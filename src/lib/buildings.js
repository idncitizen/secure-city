export const CITY_BUILDINGS = [
  {
    id: "gedung-1",
    name: "Pusat Operasi SOC",
    district: "Sektor Komando",
    role: "Pemantauan ancaman siber 24/7",
    color: "#0284C7",
    accent: "#38BDF8",
    roofColor: "#0369A1",
    position: { x: 18, y: 20 },
    width: 14,
    height: 15,
    questions: [
      {
        id: "soc-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Alert SIEM menampilkan banyak percobaan login gagal beruntun dari satu IP dalam 10 detik. Apa istilah serangan ini?",
        options: ["Brute Force", "SQL Injection", "DNS Spoofing", "Man-in-the-Middle"],
        correctIndex: 0,
        explanation: "Percobaan kredensial berulang dalam waktu singkat adalah ciri khas serangan Brute Force."
      },
      {
        id: "soc-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa fungsi utama autentikasi dua faktor (2FA/MFA) pada akun admin kota cerdas?",
        options: [
          "Menambah lapisan verifikasi selain kata sandi",
          "Menghapus riwayat log secara otomatis",
          "Mempercepat kecepatan bandwidth internet",
          "Mengganti kata sandi menjadi angka 1234"
        ],
        correctIndex: 0,
        explanation: "MFA menambahkan faktor verifikasi kedua sehingga kata sandi yang bocor saja tidak cukup untuk masuk."
      },
      {
        id: "soc-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Saat terdeteksi host internal mulai mengenkripsi banyak file secara massal, langkah isolasi awal paling tepat di SOC adalah?",
        options: [
          "Mengisolasi segmen jaringan host tersebut dan memutus akses lateral",
          "Mematikan semua server utama kota tanpa analisis",
          "Mengabaikan alert hingga jam kerja berakhir",
          "Membagikan kredensial root ke semua operator"
        ],
        correctIndex: 0,
        explanation: "Isolasi jaringan cepat mencegah penyebaran ransomware lebih luas ke sistem lain."
      },
      {
        id: "soc-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa sinkronisasi waktu (NTP) yang akurat sangat penting pada analisis log keamanan antar-server?",
        options: [
          "Agar urutan kronologis kejadian insiden dapat direkonstruksi secara valid",
          "Agar ukuran file log mengecil hingga 90%",
          "Agar firewall tidak perlu memperbarui aturan",
          "Agar password pengguna tidak kadaluarsa"
        ],
        correctIndex: 0,
        explanation: "Tanpa stempel waktu yang selaras, korelasi peristiwa antar-perangkat saat investigasi insiden menjadi bias."
      },
      {
        id: "soc-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Penyerang menggunakan teknik Living-off-the-Land (LotL) dengan PowerShell bawaan OS untuk menghindari deteksi antivirus berbasis signature. Strategi deteksi paling efektif adalah?",
        options: [
          "Mengaktifkan Script Block Logging, memantau perilaku anomali proses, dan menerapkan prinsip least privilege",
          "Menonaktifkan seluruh log skrip agar performa CPU meningkat",
          "Hanya mengandalkan pemindaian ekstensi nama file",
          "Memberikan hak akses administrator permanen ke semua akun layanan"
        ],
        correctIndex: 0,
        explanation: "LotL memanfaatkan alat sah sistem operasi, sehingga deteksi perilaku (behavioral telemetry) dan pembatasan hak akses sangat krusial."
      }
    ]
  },
  {
    id: "gedung-2",
    name: "Menara FinTech & Bank",
    district: "Kawasan Finansial",
    role: "Perlindungan transaksi & rekening warga",
    color: "#0D9488",
    accent: "#2DD4BF",
    roofColor: "#0F766E",
    position: { x: 42, y: 18 },
    width: 14,
    height: 16,
    questions: [
      {
        id: "fin-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Nasabah menerima email yang meniru domain bank dan meminta PIN melalui tautan palsu. Ini termasuk serangan?",
        options: ["Phishing", "DDoS", "ARP Poisoning", "Buffer Overflow"],
        correctIndex: 0,
        explanation: "Phishing memanipulasi korban melalui pesan/tautan palsu untuk mencuri informasi sensitif."
      },
      {
        id: "fin-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Protokol mana yang mengenkripsi komunikasi antara browser nasabah dan portal perbankan?",
        options: ["HTTPS (TLS)", "HTTP polos", "Telnet", "FTP tanpa enkripsi"],
        correctIndex: 0,
        explanation: "HTTPS menggunakan TLS untuk mengenkripsi data saat transit dan memverifikasi identitas server."
      },
      {
        id: "fin-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa tujuan utama penerapan Rate Limiting pada endpoint API transfer dana?",
        options: [
          "Membatasi jumlah permintaan beruntun untuk meredam abuse dan percobaan otomatis",
          "Menghapus kebutuhan validasi saldo rekening",
          "Menyimpan PIN nasabah dalam bentuk teks biasa di log",
          "Membuka akses API tanpa token autentikasi"
        ],
        correctIndex: 0,
        explanation: "Rate limiting membatasi laju request dari klien/IP tertentu agar endpoint tidak mudah disalahgunakan."
      },
      {
        id: "fin-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa penyimpanan kata sandi/PIN di database tidak boleh menggunakan hashing cepat tanpa salt seperti MD5 polos?",
        options: [
          "Rentan terhadap rainbow table dan tebakan cepat dengan GPU modern",
          "MD5 hanya bisa dipakai untuk gambar",
          "Hash membuat ukuran database menjadi tak terbatas",
          "MD5 selalu menghasilkan output berbeda untuk input yang sama"
        ],
        correctIndex: 0,
        explanation: "Fungsi hash khusus password (seperti Argon2 atau bcrypt) dengan salt dirancang lambat dan tahan tebakan paralel."
      },
      {
        id: "fin-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Sebuah celah IDOR (Insecure Direct Object Reference) ditemukan pada endpoint riwayat mutasi akun. Perbaikan paling tepat dan menyeluruh adalah?",
        options: [
          "Memverifikasi otorisasi kepemilikan resource di sisi server pada setiap request dan menggunakan referensi/cek akses yang ketat",
          "Menyembunyikan tombol riwayat mutasi di frontend saja",
          "Mengubah metode request dari GET menjadi POST tanpa cek sesi",
          "Menampilkan data akun lain hanya jika nomor rekening genap"
        ],
        correctIndex: 0,
        explanation: "Kontrol akses objek harus divalidasi di backend berdasarkan identitas pengguna yang terautentikasi, bukan sekadar disembunyikan di UI."
      }
    ]
  },
  {
    id: "gedung-3",
    name: "RSUD Smart Med",
    district: "Zona Kesehatan",
    role: "Keamanan rekam medis & alat medis terhubung",
    color: "#E11D48",
    accent: "#FB7185",
    roofColor: "#BE123C",
    position: { x: 68, y: 20 },
    width: 14,
    height: 15,
    questions: [
      {
        id: "med-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Data rekam medis pasien termasuk kategori data apa yang wajib dijaga kerahasiaannya?",
        options: ["Data pribadi sensitif / kesehatan", "Data publik papan pengumuman", "Informasi cuaca harian", "Jadwal bus umum"],
        correctIndex: 0,
        explanation: "Data kesehatan dan rekam medis bersifat sangat sensitif dan dilindungi regulasi privasi data."
      },
      {
        id: "med-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Mengapa staf administrasi tidak perlu diberi akses ke konfigurasi server database medis?",
        options: [
          "Prinsip Least Privilege (hak akses seminimal mungkin sesuai tugas)",
          "Karena server database tidak memiliki layar",
          "Agar staf bisa mengubah nilai tagihan secara bebas",
          "Karena hak akses tidak berpengaruh pada keamanan"
        ],
        correctIndex: 0,
        explanation: "Least privilege membatasi akses hanya pada hal yang benar-benar dibutuhkan untuk menjalankan peran."
      },
      {
        id: "med-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Bagaimana cara terbaik memisahkan perangkat IoT medis (seperti monitor pasien) dari jaringan komputer perkantoran?",
        options: [
          "Segmentasi jaringan (VLAN) dan aturan firewall ketat antar-segmen",
          "Menggabungkan semua perangkat dalam satu broadcast domain tanpa firewall",
          "Menggunakan default password pabrik agar mudah diingat",
          "Menonaktifkan pembaruan firmware selamanya"
        ],
        correctIndex: 0,
        explanation: "Segmentasi VLAN membatasi pergerakan lateral bila salah satu perangkat medis atau workstation terkompromi."
      },
      {
        id: "med-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa manfaat utama backup data rekam medis yang menerapkan aturan 3-2-1 dan salinan immutable/offline?",
        options: [
          "Menjamin pemulihan layanan saat terjadi ransomware atau kegagalan perangkat keras",
          "Menggantikan kebutuhan enkripsi data aktif",
          "Menghapus kewajiban audit akses pengguna",
          "Mempercepat query SQL tanpa indeks"
        ],
        correctIndex: 0,
        explanation: "Backup terisolasi/immutable melindungi salinan cadangan agar tidak ikut terenkripsi atau dihapus penyerang."
      },
      {
        id: "med-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Dalam sistem FHIR/API rumah sakit, token akses dicuri melalui log proxy. Mekanisme apa yang membantu membatasi penyalahgunaan token tersebut?",
        options: [
          "Masa berlaku token singkat (short-lived access token), refresh token rotation, dan pembatasan scope/audience",
          "Menjadikan access token berlaku selamanya tanpa kedaluwarsa",
          "Menyimpan token di URL query string agar mudah dibagikan",
          "Menghapus validasi signature JWT"
        ],
        correctIndex: 0,
        explanation: "Token berumur pendek dengan scope ketat dan rotasi mempersempit jendela waktu eksploitasi bila token bocor."
      }
    ]
  },
  {
    id: "gedung-4",
    name: "Pusat Data Cloud Kota",
    district: "Kawasan Infrastruktur",
    role: "Penyimpanan cloud, backup & ketersediaan layanan",
    color: "#7C3AED",
    accent: "#A78BFA",
    roofColor: "#6D28D9",
    position: { x: 84, y: 44 },
    width: 12,
    height: 15,
    questions: [
      {
        id: "cld-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa risiko utama jika bucket penyimpanan cloud dibiarkan berstatus Public Read secara tidak sengaja?",
        options: [
          "File internal atau cadangan data dapat diunduh pihak luar tanpa autentikasi",
          "Kapasitas penyimpanan menjadi 0 byte",
          "Server akan otomatis mematikan sistem operasi",
          "Kecepatan upload turun menjadi 1 bps"
        ],
        correctIndex: 0,
        explanation: "Konfigurasi bucket publik yang keliru sering menjadi penyebab kebocoran file konfigurasi dan backup."
      },
      {
        id: "cld-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Dalam triad CIA keamanan informasi, ketersediaan (Availability) berarti?",
        options: [
          "Sistem dan data dapat diakses secara andal oleh pihak berwenang saat dibutuhkan",
          "Data hanya bisa dibaca oleh satu orang saja",
          "Sistem tidak pernah mencatat aktivitas pengguna",
          "Data dihapus setiap 5 menit"
        ],
        correctIndex: 0,
        explanation: "Availability memastikan layanan digital kota tetap beroperasi dan dapat diakses sesuai SLA."
      },
      {
        id: "cld-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa secret key atau API key tidak boleh di-commit langsung ke repositori Git?",
        options: [
          "Dapat terbaca oleh siapa saja yang memiliki akses repo atau terdeteksi scanner otomatis",
          "Git akan otomatis menghapus file tersebut setelah 1 jam",
          "Secret key hanya berfungsi jika berada di dalam kode sumber",
          "Repositori Git tidak mendukung file teks"
        ],
        correctIndex: 0,
        explanation: "Kredensial yang masuk ke riwayat Git mudah disalahgunakan dan tetap tersimpan di history meski dihapus di commit berikutnya."
      },
      {
        id: "cld-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa fungsi utama Web Application Firewall (WAF) di depan aplikasi web publik kota?",
        options: [
          "Menyaring pola trafik berbahaya seperti SQL injection dan XSS sebelum mencapai aplikasi",
          "Menggantikan kebutuhan patch keamanan pada kode aplikasi",
          "Mengatur suhu ruangan rak server fisik",
          "Mencetak laporan keuangan bulanan"
        ],
        correctIndex: 0,
        explanation: "WAF membantu memblokir payload serangan web umum di lapisan HTTP, meski tetap harus dipadukan dengan kode yang aman."
      },
      {
        id: "cld-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Pada klaster container/Kubernetes pusat data, pod berjalan dengan hak akses root dan mount host filesystem. Risiko dan mitigasi yang tepat adalah?",
        options: [
          "Risiko container escape ke host; mitigasi dengan non-root user, read-only root filesystem, dan dropping capabilities",
          "Tidak ada risiko karena container terisolasi sempurna secara default",
          "Mitigasi terbaik adalah menjalankan semua container dengan --privileged",
          "Menghapus namespace dan cgroup pada kernel"
        ],
        correctIndex: 0,
        explanation: "Container berbagi kernel host, sehingga runAsNonRoot, drop capabilities, dan pembatasan mount sangat penting untuk mencegah escape."
      }
    ]
  },
  {
    id: "gedung-5",
    name: "Stasiun Transit & Lalu Lintas",
    district: "Koridor Mobilitas",
    role: "Sistem sinyal kereta & lampu lalu lintas cerdas",
    color: "#D97706",
    accent: "#FBBF24",
    roofColor: "#B45309",
    position: { x: 82, y: 74 },
    width: 14,
    height: 15,
    questions: [
      {
        id: "trf-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Jika panel kontrol lampu lalu lintas menggunakan password default admin/admin, apa tindakan pertamanya?",
        options: [
          "Segera mengganti dengan kredensial unik yang kuat dan membatasi akses jaringan",
          "Membiarkannya agar teknisi luar mudah masuk",
          "Menempelkan password di tiang lampu jalan",
          "Mematikan seluruh lampu lalu lintas"
        ],
        correctIndex: 0,
        explanation: "Kredensial default adalah titik masuk paling umum pada perangkat kontrol infrastruktur fisik/OT."
      },
      {
        id: "trf-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Mengapa pembaruan firmware pada sensor lalu lintas perlu diuji terlebih dahulu sebelum disebar serentak?",
        options: [
          "Untuk memastikan tidak menimbulkan gangguan fungsi atau downtime pada sistem kritis",
          "Agar warna lampu berubah menjadi ungu",
          "Karena firmware tidak bisa diperbarui",
          "Untuk menghapus alamat IP perangkat"
        ],
        correctIndex: 0,
        explanation: "Pengujian staging mencegah bug update mengganggu operasional lalu lintas di lapangan."
      },
      {
        id: "trf-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa yang dimaksud serangan Denial of Service (DoS) pada sistem informasi jadwal transit penumpang?",
        options: [
          "Membanjiri layanan sehingga pengguna sah kesulitan atau gagal mengakses informasi",
          "Mengubah jadwal kereta menjadi lebih cepat",
          "Mengenkripsi data di sisi klien tanpa izin",
          "Menambah jumlah gerbong kereta secara otomatis"
        ],
        correctIndex: 0,
        explanation: "DoS menargetkan ketersediaan (Availability) layanan agar down atau melambat drastis."
      },
      {
        id: "trf-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa komunikasi antar-kontroler sinyal transportasi sebaiknya menggunakan autentikasi dan enkripsi yang sesuai?",
        options: [
          "Mencegah penyadapan atau injeksi perintah palsu oleh pihak tidak berwenang",
          "Agar kabel tembaga tidak berkarat",
          "Supaya tidak perlu lagi melakukan pemeliharaan fisik",
          "Untuk menonaktifkan fail-safe perangkat"
        ],
        correctIndex: 0,
        explanation: "Autentikasi dan integritas pesan mencegah perintah manipulasi yang berpotensi membahayakan keselamatan publik."
      },
      {
        id: "trf-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Dalam arsitektur IT/OT transportasi cerdas, mengapa pendekatan DMZ / industrial firewall dan fail-safe fisik sangat krusial?",
        options: [
          "Menjaga keselamatan fisik (safety) tetap terjamin meski terjadi gangguan siber pada jaringan IT",
          "Menghubungkan langsung jaringan sensor lapangan ke internet publik tanpa NAT",
          "Mengganti seluruh mekanisme fail-safe dengan skrip otomatis tanpa verifikasi",
          "Mengabaikan pemantauan anomali trafik OT"
        ],
        correctIndex: 0,
        explanation: "Pada sistem OT/ICS, keselamatan fisik (fail-safe) dan pemisahan zona IT-OT melindungi nyawa dan infrastruktur saat terjadi insiden."
      }
    ]
  },
  {
    id: "gedung-6",
    name: "Balai Kota & Layanan Publik",
    district: "Pusat Pemerintahan",
    role: "Portal kependudukan, perizinan & e-government",
    color: "#16A34A",
    accent: "#4ADE80",
    roofColor: "#15803D",
    position: { x: 56, y: 76 },
    width: 14,
    height: 15,
    questions: [
      {
        id: "gov-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Saat mengisi formulir layanan publik di komputer umum perpustakaan kota, apa yang sebaiknya dilakukan setelah selesai?",
        options: [
          "Logout dari akun dan menutup browser/menghapus sesi aktif",
          "Membiarkan akun tetap login untuk pengguna berikutnya",
          "Menyimpan password di browser umum",
          "Meninggalkan layar terbuka begitu saja"
        ],
        correctIndex: 0,
        explanation: "Keluar dari sesi mencegah orang berikutnya mengakses data pribadi Anda di perangkat bersama."
      },
      {
        id: "gov-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa tanda awal yang patut diwaspadai pada situs tiruan layanan pajak/perizinan?",
        options: [
          "Alamat domain menyerupai/salah eja dan meminta data rahasia di luar kanal resmi",
          "Menggunakan koneksi terenkripsi dan domain resmi instansi",
          "Memiliki informasi kontak resmi yang valid",
          "Memuat halaman bantuan standar"
        ],
        correctIndex: 0,
        explanation: "Typosquatting dan permintaan data sensitif yang tidak wajar adalah indikator kuat penipuan daring."
      },
      {
        id: "gov-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Bagaimana cara mencegah celah Cross-Site Scripting (XSS) pada kolom komentar atau formulir pengaduan warga?",
        options: [
          "Melakukan encoding/escaping output saat dirender dan menerapkan Content Security Policy (CSP)",
          "Menjalankan input mentah dari pengguna langsung sebagai HTML/script",
          "Menghapus validasi input di sisi server",
          "Menyimpan skrip JavaScript milik pengunjung ke database eksekusi"
        ],
        correctIndex: 0,
        explanation: "Output encoding dan CSP mencegah skrip berbahaya dieksekusi di browser pengunjung lain."
      },
      {
        id: "gov-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa fungsi utama audit trail pada sistem administrasi kependudukan?",
        options: [
          "Mencatat siapa mengubah/mengakses data apa dan kapan untuk akuntabilitas",
          "Menghapus jejak perubahan data secara otomatis",
          "Menggantikan kebutuhan autentikasi login",
          "Memperbesar ukuran font tampilan web"
        ],
        correctIndex: 0,
        explanation: "Audit trail memberikan jejak pertanggungjawaban atas setiap akses dan perubahan data penting."
      },
      {
        id: "gov-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Formulir pengajuan izin rentan terhadap CSRF (Cross-Site Request Forgery). Mekanisme pertahanan yang tepat adalah?",
        options: [
          "Menggunakan anti-CSRF token unik per sesi/request dan atribut cookie SameSite yang tepat",
          "Mengandalkan cookie tanpa SameSite dan menerima request lintas origin tanpa verifikasi",
          "Menampilkan peringatan teks di bagian bawah halaman",
          "Menonaktifkan HTTPS pada halaman login"
        ],
        correctIndex: 0,
        explanation: "Anti-CSRF token dan konfigurasi cookie SameSite memastikan request berasal dari aksi sah di aplikasi."
      }
    ]
  },
  {
    id: "gedung-7",
    name: "Kampus Riset Siber",
    district: "Distrik Inovasi",
    role: "Laboratorium keamanan, kriptografi & AI aman",
    color: "#2563EB",
    accent: "#60A5FA",
    roofColor: "#1D4ED8",
    position: { x: 30, y: 76 },
    width: 14,
    height: 15,
    questions: [
      {
        id: "lab-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Mengapa file instalasi software riset sebaiknya diverifikasi nilai hash/checksum-nya sebelum dijalankan?",
        options: [
          "Memastikan file tidak dimodifikasi atau disisipi malware selama pengunduhan",
          "Agar ukuran file menjadi 0 KB",
          "Untuk mengubah bahasa sistem operasi",
          "Agar tidak perlu koneksi internet"
        ],
        correctIndex: 0,
        explanation: "Verifikasi hash/signature memastikan integritas file sesuai dengan sumber resminya."
      },
      {
        id: "lab-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa praktik terbaik saat membuat kata sandi untuk akun riset kampus?",
        options: [
          "Panjang, unik untuk tiap layanan, dan dikelola dengan password manager",
          "Sama untuk email kampus, media sosial, dan bank",
          "Menggunakan tanggal lahir saja",
          "Dibagikan di grup chat publik"
        ],
        correctIndex: 0,
        explanation: "Kata sandi unik dan panjang mencegah credential stuffing bila satu layanan lain mengalami kebocoran data."
      },
      {
        id: "lab-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa tujuan utama menjalankan pengujian aplikasi di lingkungan staging/sandbox sebelum rilis produksi?",
        options: [
          "Menguji keamanan dan stabilitas perubahan tanpa membahayakan data serta layanan produksi",
          "Menghindari proses code review sepenuhnya",
          "Menyimpan data sensitif nyata tanpa perlindungan",
          "Menonaktifkan seluruh pengujian otomatis"
        ],
        correctIndex: 0,
        explanation: "Sandbox/staging memungkinkan eksperimen dan pengujian keamanan secara aman sebelum menyentuh produksi."
      },
      {
        id: "lab-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa dependensi library pihak ketiga (npm/pip) perlu dipindai kerentanannya secara berkala (SCA)?",
        options: [
          "Karena kerentanan pada library eksternal dapat ikut tereksploitasi di aplikasi kita",
          "Library pihak ketiga tidak pernah memiliki bug keamanan",
          "Pemindaian hanya diperlukan saat proyek pertama dibuat",
          "Dependensi tidak memengaruhi keamanan aplikasi web"
        ],
        correctIndex: 0,
        explanation: "Supply chain attack dan CVE pada dependensi sering menjadi jalur masuk serangan pada aplikasi modern."
      },
      {
        id: "lab-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Pada sistem deteksi AI kampus, penyerang melakukan adversarial input manipulation agar model salah klasifikasi. Langkah penguatan yang relevan adalah?",
        options: [
          "Adversarial training, validasi input/anomaly check, dan pembatasan aksi otomatis berisiko tinggi tanpa human-in-the-loop",
          "Menganggap prediksi model AI selalu kebal terhadap manipulasi input",
          "Menghapus seluruh logging prediksi model",
          "Memberikan akses eksekusi perintah langsung dari output mentah model"
        ],
        correctIndex: 0,
        explanation: "Adversarial training, validasi batas input, dan kontrol manusia untuk tindakan kritis mengurangi dampak manipulasi model."
      }
    ]
  },
  {
    id: "gedung-8",
    name: "Menara Telekomunikasi",
    district: "Jaringan & Konektivitas",
    role: "Infrastruktur fiber, Wi-Fi publik & 5G kota",
    color: "#0891B2",
    accent: "#22D3EE",
    roofColor: "#0E7490",
    position: { x: 14, y: 48 },
    width: 12,
    height: 15,
    questions: [
      {
        id: "tel-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Saat terhubung ke Wi-Fi gratis di taman kota yang tidak terenkripsi, aktivitas apa yang paling berisiko?",
        options: [
          "Mengirim kredensial atau data sensitif lewat halaman tanpa HTTPS",
          "Membaca berita umum yang statis",
          "Melihat peta lokasi taman",
          "Menyalakan mode pesawat"
        ],
        correctIndex: 0,
        explanation: "Jaringan publik terbuka rawan penyadapan/evil twin, sehingga enkripsi end-to-end (HTTPS/VPN) sangat penting."
      },
      {
        id: "tel-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Standar keamanan Wi-Fi modern mana yang lebih kuat dibanding WEP atau enkripsi terbuka?",
        options: ["WPA2 / WPA3", "WEP", "Tanpa password (Open)", "MAC address saja"],
        correctIndex: 0,
        explanation: "WEP sudah usang dan mudah dipecahkan; WPA2 dan WPA3 memberikan enkripsi jauh lebih kuat."
      },
      {
        id: "tel-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Bagaimana cara mengurangi risiko serangan Rogue Access Point / Evil Twin di area publik?",
        options: [
          "Memverifikasi SSID/sertifikat resmi, menggunakan VPN, dan memantau AP tidak sah di jaringan",
          "Menghubungkan perangkat ke hotspot acak bernama 'Free_Admin_WiFi'",
          "Mematikan firewall perangkat saat di luar ruangan",
          "Menyimpan sertifikat root sembarangan tanpa verifikasi"
        ],
        correctIndex: 0,
        explanation: "Penggunaan VPN dan deteksi access point ilegal membantu mencegah intersepsi trafik oleh titik akses palsu."
      },
      {
        id: "tel-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Apa fungsi utama DNSSEC pada resolusi nama domain infrastruktur kota?",
        options: [
          "Membantu memverifikasi keaslian dan integritas respons DNS agar tidak mudah dipalsukan",
          "Mempercepat pengunduhan video 4K",
          "Menggantikan kebutuhan firewall jaringan",
          "Menghapus alamat IP dari DNS"
        ],
        correctIndex: 0,
        explanation: "DNSSEC menambahkan tanda tangan kriptografis pada data DNS untuk mencegah pemalsuan respons/spoofing."
      },
      {
        id: "tel-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Pada jaringan inti/edge telekomunikasi kota, prinsip Zero Trust Architecture (ZTA) diterapkan dengan cara?",
        options: [
          "Tidak mempercayai trafik secara implisit hanya karena berada di jaringan internal; selalu verifikasi identitas, perangkat, dan konteks",
          "Menganggap semua trafik di dalam LAN sudah pasti aman selamanya",
          "Membuka seluruh port manajemen ke internet agar mudah dipantau",
          "Menghapus kebijakan segmentasi dan otorisasi"
        ],
        correctIndex: 0,
        explanation: "Zero Trust memperlakukan setiap akses—baik internal maupun eksternal—sebagai potensi risiko yang harus diverifikasi terus-menerus."
      }
    ]
  },
  {
    id: "gedung-9",
    name: "Hub Logistik & Pelabuhan",
    district: "Kawasan Distribusi",
    role: "Rantai pasok, RFID kargo & pelacakan armada",
    color: "#EA580C",
    accent: "#FB923C",
    roofColor: "#C2410C",
    position: { x: 34, y: 46 },
    width: 13,
    height: 14,
    questions: [
      {
        id: "log-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Mengapa perangkat pemindai/tablet gudang logistik perlu dikunci layar otomatis saat ditinggalkan?",
        options: [
          "Mencegah pihak tidak berwenang mengubah data pengiriman atau mengakses sistem",
          "Agar baterai cepat habis",
          "Supaya layar tidak bisa disentuh lagi",
          "Untuk menghapus aplikasi inventaris"
        ],
        correctIndex: 0,
        explanation: "Auto-lock melindungi sesi aktif pada perangkat mobile yang berpindah tangan di area gudang."
      },
      {
        id: "log-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa manfaat utama mencatat nomor resi/manifest secara terintegrasi dan tervalidasi?",
        options: [
          "Menjaga integritas data pengiriman dan memudahkan pelacakan anomali",
          "Menghilangkan kebutuhan pengecekan fisik barang",
          "Membuat data tidak perlu di-backup",
          "Membuka akses publik ke seluruh rute rahasia"
        ],
        correctIndex: 0,
        explanation: "Validasi dan pencatatan yang baik menjaga integritas rantai pasok serta mempermudah audit."
      },
      {
        id: "log-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Jika vendor software pelacakan armada mengalami kebocoran kredensial API, langkah prioritas pertama adalah?",
        options: [
          "Mencabut/merotasi API key yang terdampak dan memeriksa log aktivitas akses terkait",
          "Menunggu laporan pengguna minggu depan tanpa tindakan",
          "Menonaktifkan seluruh autentikasi agar sistem tetap jalan",
          "Menghapus semua data pengiriman historis"
        ],
        correctIndex: 0,
        explanation: "Revoke & rotasi kredensial segera menutup akses tidak sah sambil menelusuri jejak pemakaian token tersebut."
      },
      {
        id: "log-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa validasi input di sisi server tetap wajib meski formulir web sudah memakai validasi JavaScript?",
        options: [
          "Karena validasi di sisi klien mudah dilewati menggunakan tools/request langsung ke API",
          "JavaScript tidak bisa memeriksa teks",
          "Validasi server membuat halaman tidak bisa di-scroll",
          "Validasi klien selalu mengenkripsi data"
        ],
        correctIndex: 0,
        explanation: "Penyerang dapat mengirim request HTTP langsung ke server tanpa melewati validasi browser/JavaScript."
      },
      {
        id: "log-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Sistem pelacakan GPS/telemetri armada menerima data lokasi palsu (spoofing) yang memicu alert rute menyimpang. Desain pertahanan yang tepat adalah?",
        options: [
          "Autentikasi perangkat/pesan telemetri, validasi konsistensi kecepatan/rute (sanity check), dan korelasi multi-sumber",
          "Mempercayai setiap paket telemetri mentah tanpa cek format atau autentikasi",
          "Mematikan semua alert anomali agar dashboard bersih",
          "Mengirimkan kunci privat perangkat ke setiap kendaraan"
        ],
        correctIndex: 0,
        explanation: "Autentikasi sumber data dan sanity check fisika/rute membantu menyaring data telemetri yang dipalsukan."
      }
    ]
  },
  {
    id: "gedung-10",
    name: "Pusat Energi & Smart Grid",
    district: "Sektor Utilitas",
    role: "Distribusi listrik kota & pemantauan beban",
    color: "#65A30D",
    accent: "#A3E635",
    roofColor: "#4D7C0F",
    position: { x: 60, y: 47 },
    width: 13,
    height: 14,
    questions: [
      {
        id: "grd-p1",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Mengapa akses jarak jauh (remote access) ke sistem kontrol utilitas listrik harus menggunakan VPN dan MFA?",
        options: [
          "Mencegah akses tidak sah ke kontrol infrastruktur vital energi kota",
          "Agar tagihan listrik warga otomatis gratis",
          "Supaya tidak perlu lagi ada teknisi lapangan",
          "Untuk menonaktifkan sistem proteksi arus"
        ],
        correctIndex: 0,
        explanation: "Remote access tanpa autentikasi berlapis dan kanal aman berisiko tinggi disalahgunakan pada infrastruktur energi."
      },
      {
        id: "grd-p2",
        level: "pemula",
        points: 1,
        baseTime: 25,
        prompt: "Apa arti istilah 'patch management' dalam keamanan sistem informasi?",
        options: [
          "Proses menerapkan pembaruan keamanan untuk menutup celah kerentanan pada software/OS",
          "Proses mengganti kabel listrik di jalan",
          "Menghapus seluruh akun pengguna setiap hari",
          "Mencetak manual pengguna ke kertas"
        ],
        correctIndex: 0,
        explanation: "Patch management menutup kerentanan yang sudah diketahui agar tidak dimanfaatkan exploit publik."
      },
      {
        id: "grd-m1",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Mengapa pemisahan tugas (Separation of Duties) penting pada perubahan konfigurasi kritis di smart grid?",
        options: [
          "Mencegah satu pihak melakukan perubahan berbahaya tanpa persetujuan/tinjauan pihak lain",
          "Membuat proses kerja menjadi tidak terdokumentasi",
          "Menghilangkan kebutuhan persetujuan manajerial",
          "Memperbolehkan perubahan langsung tanpa uji coba"
        ],
        correctIndex: 0,
        explanation: "Separation of duties mengurangi risiko kesalahan manusia maupun penyalahgunaan wewenang tunggal."
      },
      {
        id: "grd-m2",
        level: "menengah",
        points: 2,
        baseTime: 35,
        prompt: "Jika terjadi lonjakan trafik anomali pada gateway meteran pintar, langkah pemantauan yang paling tepat adalah?",
        options: [
          "Menganalisis sumber trafik, membatasi koneksi mencurigakan, dan mengeskalasi ke tim keamanan",
          "Menghapus log trafik agar kapasitas disk lega",
          "Membuka akses telnet publik untuk debugging cepat",
          "Mengabaikan lonjakan karena dianggap normal"
        ],
        correctIndex: 0,
        explanation: "Analisis sumber anomali, pembatasan trafik, dan eskalasi insiden membantu mitigasi sejak dini."
      },
      {
        id: "grd-h1",
        level: "mahir",
        points: 3,
        baseTime: 45,
        prompt: "Pada sistem kontrol energi terdistribusi, serangan replay/injeksi perintah dapat mengacaukan keseimbangan beban. Mekanisme perlindungan utama adalah?",
        options: [
          "Autentikasi kriptografis pesan, nonce/timestamp anti-replay, dan pembatasan zona kontrol dengan allowlist ketat",
          "Mengirim perintah kontrol dalam plaintext tanpa verifikasi sumber",
          "Mengizinkan koneksi masuk dari sembarang alamat IP di internet",
          "Menonaktifkan alarm ambang batas beban"
        ],
        correctIndex: 0,
        explanation: "Autentikasi pesan, proteksi replay, dan allowlist ketat menjaga integritas perintah kontrol pada sistem kritis."
      }
    ]
  }
];

export const LEVEL_META = {
  pemula: {
    label: "Pemula",
    badgeClass: "bg-emerald-100 text-emerald-800 border-emerald-300",
    defaultTime: 25
  },
  menengah: {
    label: "Menengah",
    badgeClass: "bg-amber-100 text-amber-800 border-amber-300",
    defaultTime: 35
  },
  mahir: {
    label: "Mahir",
    badgeClass: "bg-rose-100 text-rose-800 border-rose-300",
    defaultTime: 45
  }
};

export function getBuildingById(id) {
  return CITY_BUILDINGS.find((b) => b.id === id) || null;
}

export function getOrderedQuestions(building) {
  if (!building || !Array.isArray(building.questions)) return [];
  const order = { pemula: 1, menengah: 2, mahir: 3 };
  return [...building.questions].sort((a, b) => (order[a.level] || 99) - (order[b.level] || 99));
}
