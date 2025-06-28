from scipy.optimize import linprog
import numpy as np
from core.models import KandunganNutrien, KebutuhanNutrien, Nutrien
from decimal import Decimal

def formulasi_lp(jenis_unggas, fase, bahan_pakan_list):
    # Ambil kebutuhan nutrien untuk jenis unggas & fase tertentu
    kebutuhan_qs = KebutuhanNutrien.objects.filter(jenis_unggas=jenis_unggas, fase=fase)

    # Ambil daftar nutrien unik yang dibutuhkan dan urutkan
    nutrien_objs = Nutrien.objects.filter(
        id__in=kebutuhan_qs.values_list('nutrien', flat=True).distinct()
    ).order_by('id')

    # Pengecekan data nutrien
    if not nutrien_objs.exists():
        return {
            'status': 'failed',
            'message': 'Tidak ada data nutrien yang tersedia untuk jenis unggas dan fase ini.'
        }

    # Inisialisasi matriks kendala (A_ub dan b_ub) untuk batas nutrien
    A_ub = []  # Daftar baris kendala (batas maksimum dan minimum)
    b_ub = []  # Batas nilai masing-masing baris di A_ub

    for nutrien in nutrien_objs:
        # Ambil objek kebutuhan nutrien (bisa min, max, atau keduanya)
        kebutuhan = kebutuhan_qs.filter(nutrien=nutrien).first()

        # Siapkan satu baris untuk nutrien ini, berisi kandungan dari setiap bahan
        row = []
        for bahan in bahan_pakan_list:
            # Ambil nilai kandungan nutrien untuk setiap bahan
            kandungan = KandunganNutrien.objects.filter(
                bahan_pakan=bahan, nutrien=nutrien
            ).first()
            nilai = float(kandungan.nilai) / 100 if kandungan else 0.0
            row.append(nilai)

        # Tambahkan kendala batas bawah (min_value): -Ax ≤ -b
        if kebutuhan.min_value is not None:
            A_ub.append([-x for x in row])               # dikali -1 agar ≤
            b_ub.append(-float(kebutuhan.min_value))       # dikali -1

        # Tambahkan kendala batas atas (max_value): Ax ≤ b
        if kebutuhan.max_value is not None:
            A_ub.append(row)
            b_ub.append(float(kebutuhan.max_value))

    # Fungsi prioritas bahan pakan yang digunakan
    def prioritas_score(bahan):
        return bahan.prioritas if bahan.prioritas is not None else 1000

    # Koefisien fungsi objektif: preferensi dominasi
    c = [prioritas_score(bahan) for bahan in bahan_pakan_list]

    # Batasan tiap bahan
    bounds = []
    for bahan in bahan_pakan_list:
        min_pakai = float(bahan.min_penggunaan if bahan.min_penggunaan is not None else 0)
        max_pakai = float(bahan.max_penggunaan if bahan.max_penggunaan is not None else 100)
        bounds.append((min_pakai, max_pakai))

    # Kendala total bahan = 100%
    A_eq = [np.ones(len(bahan_pakan_list)).tolist()]
    b_eq = [100.0]

    diagnosis = []
    for nutrien in nutrien_objs:
        # Ambil baris kandungan nutrien yg barusan kita buat
        row = []
        for bahan in bahan_pakan_list:
            kandungan = KandunganNutrien.objects.filter(
                bahan_pakan=bahan, nutrien=nutrien
            ).first()
            row.append(float(kandungan.nilai) / 100 if kandungan else 0.0)

        # Hitung *rentang* yang bisa dicapai dgn bounds tiap bahan
        min_possible = sum(row[i] * bounds[i][0] for i in range(len(bounds)))
        max_possible = sum(row[i] * bounds[i][1] for i in range(len(bounds)))

        kebutuhan = kebutuhan_qs.filter(nutrien=nutrien).first()
        diagnosis.append({
            "nutrien"        : nutrien.nama,
            "dibutuhkan_min" : kebutuhan.min_value,
            "dibutuhkan_max" : kebutuhan.max_value,
            "bisa_min"       : round(min_possible, 4),
            "bisa_max"       : round(max_possible, 4),
        })

    # Cetak ke log terminal / gunicorn / console
    # print("=== DIAGNOSA NUTRIEN ===")
    # for d in diagnosis:
    #     print(d)
    # print("=== END DIAGNOSA ===")

    # Hitung LP menggunakan solver 'highs' dari SciPy
    result = linprog(
        c=c,
        A_ub=np.array(A_ub) if A_ub else None,
        b_ub=np.array(b_ub) if b_ub else None,
        A_eq=np.array(A_eq),
        b_eq=np.array(b_eq),
        bounds=bounds,
        method='highs'
    )

    # Jika solusi ditemukan
    if result.success:
        # Hitung kandungan aktual nutrien dari solusi
        nutrien_aktual = []
        for nutrien in nutrien_objs:
            total = 0.0
            for i, bahan in enumerate(bahan_pakan_list):
                kandungan = KandunganNutrien.objects.filter(
                    bahan_pakan=bahan, nutrien=nutrien
                ).first()
                nilai = float(kandungan.nilai) / 100 if kandungan else 0.0
                total += nilai * result.x[i]

            kebutuhan = kebutuhan_qs.filter(nutrien=nutrien).first()
            nutrien_aktual.append({
                'nama': nutrien.nama,
                'aktual': round(total, 4),
                'dibutuhkan_min': kebutuhan.min_value,
                'dibutuhkan_max': kebutuhan.max_value,
            })

        solusi = result.x  # Nilai optimal setiap bahan
        # Format hasil ke bentuk dictionary
        return {
            'status': 'success',
            'komposisi': [
                {
                    'bahan_pakan_id': bahan.id,
                    'nama': bahan.nama,
                    'jumlah': round(sol, 4),  # pembulatan untuk presentasi
                    'harga_per_kg': bahan.harga,
                    'harga': bahan.harga * Decimal(str(sol)) / Decimal('100')
                }
                for bahan, sol in zip(bahan_pakan_list, solusi)
            ],
            'kandungan_nutrien': nutrien_aktual,
            'total_biaya': round(sum(bahan.harga * Decimal(str(sol)) / Decimal('100') for bahan, sol in zip(bahan_pakan_list, solusi)), 2)
        }
    else:
        # Jika gagal, kembalikan pesan error
        return {
            'status': 'failed',
            'message': f'Formulasi gagal dihitung. {result.message}'
        }
