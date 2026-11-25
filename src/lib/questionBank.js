// 10 Gedung x (3 Pemula [1pt] + 2 Menengah [2pt] + 1 Mahir [3pt]) = 10 pt/gedung -> Total 100 pt
export const BUILDINGS_DATA = [
  {
    id: 1,
    name: "1. Gerbang Autentikasi (Auth Tower)",
    topic: "Authentication & Session Security",
    color: "#3b82f6",
    position: [-12, 0, -10],
    height: 4.5,
    levels: {
      pemula: [
        {
          id: "b1_p1",
          q: "Manakah cara penyimpanan password yang paling aman di basis data?",
          options: [
            "Enkripsi AES-256 dengan kunci statis",
            "Hash Argon2id atau bcrypt dengan salt unik per pengguna",
            "Hash SHA-256 tanpa salt",
            "Encoding Base64",
            "Menyimpan plain text di kolom terpisah"
          ],
          answer: 1,
          points: 1
        },
        {
          id: "b1_p2",
          q: "Apa fungsi utama atribut 'HttpOnly' pada cookie sesi?",
          options: [
            "Menghapus cookie otomatis saat tab ditutup",
            "Mencegah akses cookie oleh skrip JavaScript browser (mitigasi XSS)",
            "Memaksa koneksi menggunakan port 80",
            "Mengompres ukuran cookie",
            "Mengizinkan akses lintas subdomain tanpa batas"
          ],
          answer: 1,
          points: 1
        },
        {
          id: "b1_p3",
          q: "Mengapa pesan gagal login sebaiknya generik ('Kredensial tidak valid')?",
          options: [
            "Menghemat ruang penyimpanan server",
            "Mencegah enumerasi akun pengguna (Username Enumeration)",
            "Menghindari serangan DDoS",
            "Mempercepat respons CSS",
            "Mengganti kebutuhan HTTPS"
          ],
          answer: 1,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b1_m1",
          q: "Kapan kerentanan 'Session Fixation' paling mungkin terjadi?",
          options: [
            "Ketika session ID tidak diregenerasi setelah proses autentikasi berhasil",
            "Ketika token JWT kedaluwarsa setelah 15 menit",
            "Ketika server menggunakan TLS 1.3",
            "Ketika cookie memiliki flag Secure",
            "Ketika pengguna logout dari seluruh perangkat"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b1_m2",
          q: "Apa risiko utama jika verifikasi JWT menerima algoritma 'none'?",
          options: [
            "Token menjadi terenkripsi ganda",
            "Penyerang dapat memodifikasi klaim payload tanpa tanda tangan valid",
            "Ukuran header melebihi batas HTTP",
            "Refresh token terhapus otomatis",
            "Server menolak semua request GET"
          ],
          answer: 1,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b1_h1",
          q: "Dalam arsitektur OAuth 2.0 untuk aplikasi publik (SPA/Mobile), mengapa PKCE (Proof Key for Code Exchange) wajib digunakan?",
          options: [
            "Untuk mengenkripsi lalu lintas DNS secara penuh",
            "Untuk mencegah Authorization Code Interception / Injection oleh aplikasi jahat",
            "Untuk menggantikan kebutuhan HTTPS",
            "Untuk memperpanjang umur session cookie selamanya",
            "Untuk menonaktifkan redirect URI"
          ],
          answer: 1,
          points: 3
        }
      ]
    }
  },
  {
    id: 2,
    name: "2. Pusat Data Warga (SQL Vault)",
    topic: "SQL & Query Injection",
    color: "#ef4444",
    position: [-6, 0, -10],
    height: 5.5,
    levels: {
      pemula: [
        {
          id: "b2_p1",
          q: "Apa akar penyebab utama SQL Injection?",
          options: [
            "Penggunaan indeks pada tabel",
            "Penggabungan input pengguna langsung ke string query tanpa parameterisasi",
            "Penggunaan tipe data INT",
            "Mengaktifkan koneksi pooling",
            "Menyimpan backup di cloud"
          ],
          answer: 1,
          points: 1
        },
        {
          id: "b2_p2",
          q: "Mekanisme utama untuk mencegah SQL Injection pada query data adalah...",
          options: [
            "Prepared Statements / Parameterized Queries",
            "Menyembunyikan port database",
            "Mengubah huruf input menjadi kapital",
            "Menghapus tanda spasi",
            "Menggunakan koneksi HTTP biasa"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b2_p3",
          q: "Apa dampak umum payload `' OR '1'='1` pada form login rentan?",
          options: [
            "Menghapus seluruh sistem operasi",
            "Evaluasi kondisi logika menjadi selalu benar sehingga bypass autentikasi",
            "Mengubah bahasa browser",
            "Menutup firewall server",
            "Menyalin file konfigurasi SSH"
          ],
          answer: 1,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b2_m1",
          q: "Bagaimana penyerang mengekstrak informasi pada Time-Based Blind SQL Injection?",
          options: [
            "Membaca pesan error sintaks langsung di layar",
            "Mengamati jeda waktu respons akibat fungsi penundaan seperti SLEEP() atau pg_sleep()",
            "Mengunduh file .sql dari direktori publik",
            "Memindai port terbuka dengan Nmap",
            "Mengubah header User-Agent"
          ],
          answer: 1,
          points: 2
        },
        {
          id: "b2_m2",
          q: "Mengapa parameterisasi tidak dapat diterapkan langsung pada nama kolom dinamis di klausa ORDER BY?",
          options: [
            "Karena driver SQL memperlakukan parameter sebagai nilai literal, bukan identifier kolom",
            "Karena ORDER BY selalu dieksekusi di klien",
            "Karena tipe data string tidak didukung",
            "Karena indeks tidak bekerja pada ORDER BY",
            "Karena sintaks SQL melarang pengurutan"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b2_h1",
          q: "Saat mengizinkan pengurutan dinamis (ORDER BY) berdasarkan input pengguna, pendekatan paling aman adalah...",
          options: [
            "Menghapus karakter titik koma (;) saja",
            "Memetakan input melalui allowlist eksplisit ke nama kolom yang diizinkan di kode aplikasi",
            "Menggunakan base64 decode pada nama kolom",
            "Menonaktifkan exception handling",
            "Menggunakan akun database superuser"
          ],
          answer: 1,
          points: 3
        }
      ]
    }
  },
  {
    id: 3,
    name: "3. Menara Penyiaran Kota (XSS Spire)",
    topic: "Cross-Site Scripting (XSS)",
    color: "#f59e0b",
    position: [0, 0, -10],
    height: 6.0,
    levels: {
      pemula: [
        {
          id: "b3_p1",
          q: "Jenis XSS manakah yang payload-nya tersimpan permanen di server/database dan tampil ke banyak pengguna?",
          options: [
            "Reflected XSS",
            "Stored (Persistent) XSS",
            "Self-contained CSS reset",
            "DNS Cache Poisoning",
            "ARP Spoofing"
          ],
          answer: 1,
          points: 1
        },
        {
          id: "b3_p2",
          q: "Properti DOM mana yang berisiko memicu XSS jika menerima input mentah dari pengguna?",
          options: [
            "textContent",
            "innerHTML",
            "nodeValue (sebagai teks)",
            "dataset",
            "classList"
          ],
          answer: 1,
          points: 1
        },
        {
          id: "b3_p3",
          q: "Teknik dasar untuk mencegah XSS saat menampilkan teks biasa ke halaman web adalah...",
          options: [
            "Output encoding sesuai konteks (HTML, atribut, atau skrip)",
            "Menghapus cookie di server",
            "Menggunakan port 8080",
            "Menonaktifkan TLS",
            "Mengganti ekstensi file menjadi .txt"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b3_m1",
          q: "Header HTTP manakah yang membantu membatasi asal skrip dan sumber daya yang boleh dimuat browser?",
          options: [
            "Content-Security-Policy (CSP)",
            "X-Powered-By",
            "Server",
            "Age",
            "Accept-Encoding"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b3_m2",
          q: "Mengapa sekadar melakukan `input.replace('<script>', '')` mudah dilewati penyerang?",
          options: [
            "Karena skrip dapat disisipkan lewat variasi huruf besar/kecil atau event handler seperti `<img src=x onerror=...>`",
            "Karena fungsi replace tidak ada di JavaScript",
            "Karena browser mengabaikan tag HTML",
            "Karena karakter '<' tidak bisa diganti",
            "Karena server memblokir string 'script'"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b3_h1",
          q: "Dalam mitigasi XSS modern dengan CSP, mengapa penggunaan `nonce` acak per request lebih aman dibanding `'unsafe-inline'`?",
          options: [
            "Karena nonce mengenkripsi seluruh kode JavaScript",
            "Karena hanya tag inline yang memiliki atribut nonce cocok dengan nonce unik pada header respons saat itu yang diizinkan",
            "Karena nonce menonaktifkan eksekusi skrip eksternal",
            "Karena nonce menggantikan validasi sisi server",
            "Karena nonce mengompres file bundle"
          ],
          answer: 1,
          points: 3
        }
      ]
    }
  },
  {
    id: 4,
    name: "4. Bank Sentral Kota (Access Control HQ)",
    topic: "Broken Access Control & IDOR",
    color: "#10b981",
    position: [6, 0, -10],
    height: 5.0,
    levels: {
      pemula: [
        {
          id: "b4_p1",
          q: "Pengguna mengubah parameter ID pada endpoint dan mengakses data milik pengguna lain. Istilahnya adalah...",
          options: [
            "IDOR (Insecure Direct Object Reference)",
            "CSRF",
            "Clickjacking",
            "Buffer Overflow",
            "SYN Flood"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b4_p2",
          q: "Prinsip keamanan yang membatasi hak akses hanya pada izin yang benar-benar dibutuhkan disebut...",
          options: [
            "Least Privilege",
            "Security by Obscurity",
            "Open Access",
            "Default Allow",
            "Single Point of Failure"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b4_p3",
          q: "Mengapa menyembunyikan menu admin di frontend tidak cukup untuk mengamankan fitur admin?",
          options: [
            "Karena endpoint API backend tetap dapat dipanggil langsung oleh klien",
            "Karena browser selalu menampilkan menu tersembunyi",
            "Karena CSS tidak bekerja di perangkat mobile",
            "Karena token otomatis kedaluwarsa",
            "Karena database menolak request POST"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b4_m1",
          q: "Apa yang dimaksud dengan Vertical Privilege Escalation?",
          options: [
            "Mengakses data sesama pengguna biasa",
            "Pengguna dengan hak akses rendah memperoleh hak akses fitur/peran yang lebih tinggi (misalnya admin)",
            "Memindahkan database ke server lain",
            "Mengirim banyak request dalam satu detik",
            "Mengubah resolusi layar aplikasi"
          ],
          answer: 1,
          points: 2
        },
        {
          id: "b4_m2",
          q: "Bagaimana cara paling tepat mencegah Mass Assignment pada endpoint pembaruan profil?",
          options: [
            "Melakukan binding eksplisit hanya pada field yang diizinkan (allowlist) di server",
            "Mengenkripsi body request dengan Base64",
            "Menggunakan metode GET untuk update data",
            "Menghapus validasi tipe data",
            "Menyimpan peran pengguna di localStorage saja"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b4_h1",
          q: "Pada sistem multi-tenant berbasis API, di mana otorisasi kepemilikan sumber daya (ownership check) harus dilakukan?",
          options: [
            "Di sisi klien setelah data diterima",
            "Di sisi server pada setiap permintaan setelah identitas pengguna terverifikasi, dipadukan dengan scope tenant/owner",
            "Hanya saat login pertama kali",
            "Di komentar kode sumber",
            "Di header Cache-Control"
          ],
          answer: 1,
          points: 3
        }
      ]
    }
  },
  {
    id: 5,
    name: "5. Gardu Kriptografi (Crypto Lab)",
    topic: "Cryptography & Secure Randomness",
    color: "#8b5cf6",
    position: [12, 0, -10],
    height: 4.8,
    levels: {
      pemula: [
        {
          id: "b5_p1",
          q: "Fungsi kriptografi satu arah yang menghasilkan nilai ringkas (digest) berukuran tetap disebut...",
          options: [
            "Cryptographic Hash Function",
            "Symmetric Encryption",
            "Digital Certificate",
            "Key Exchange",
            "Compression"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b5_p2",
          q: "Algoritma hash manakah yang sudah tidak direkomendasikan untuk keamanan karena collision attack?",
          options: [
            "SHA-256",
            "SHA-3",
            "MD5",
            "BLAKE2b",
            "SHA-512"
          ],
          answer: 2,
          points: 1
        },
        {
          id: "b5_p3",
          q: "Protokol apa yang mengamankan saluran komunikasi web melalui enkripsi dan autentikasi server?",
          options: [
            "TLS (HTTPS)",
            "Telnet",
            "HTTP",
            "FTP polos",
            "SMTP tanpa enkripsi"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b5_m1",
          q: "Mengapa mode AES-ECB tidak aman untuk mengenkripsi data terstruktur?",
          options: [
            "Karena blok plaintext yang sama menghasilkan blok ciphertext yang sama sehingga pola terlihat",
            "Karena kunci AES-ECB selalu 8 bit",
            "Karena tidak mendukung kunci simetris",
            "Karena hanya bisa mengenkripsi angka",
            "Karena memerlukan dua kunci privat"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b5_m2",
          q: "Mengapa `Math.random()` tidak boleh dipakai untuk membuat token reset password atau session token?",
          options: [
            "Karena bersifat pseudo-random yang dapat diprediksi, bukan CSPRNG",
            "Karena selalu menghasilkan angka 0",
            "Karena tidak bisa dikonversi ke string",
            "Karena menyebabkan error pada Node.js",
            "Karena hanya berfungsi secara offline"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b5_h1",
          q: "Apa keuntungan utama Authenticated Encryption seperti AES-GCM dibandingkan enkripsi tanpa autentikasi?",
          options: [
            "Menjamin kerahasiaan sekaligus mendeteksi jika ciphertext diubah/dimanipulasi (integritas & autentisitas)",
            "Menghilangkan kebutuhan manajemen kunci rahasia",
            "Membuat ukuran data menjadi 0 byte",
            "Memungkinkan dekripsi tanpa kunci",
            "Menggantikan kebutuhan hashing password"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  },
  {
    id: 6,
    name: "6. Stasiun API Gateway (API Hub)",
    topic: "API Security, CORS & Rate Limiting",
    color: "#ec4899",
    position: [-12, 0, 8],
    height: 4.5,
    levels: {
      pemula: [
        {
          id: "b6_p1",
          q: "Apa fungsi utama Rate Limiting pada endpoint API autentikasi?",
          options: [
            "Membatasi jumlah permintaan dalam periode tertentu untuk menekan brute force & abuse",
            "Meningkatkan ukuran paket jaringan",
            "Menghapus kebutuhan token",
            "Menyimpan sesi di URL",
            "Mengganti sertifikat TLS"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b6_p2",
          q: "Mengapa secret key atau private key tidak boleh disimpan di kode frontend?",
          options: [
            "Karena kode frontend dapat diperiksa/diunduh oleh pengguna di browser",
            "Karena frontend tidak mendukung variabel string",
            "Karena browser menghapus semua variabel saat dimuat",
            "Karena key hanya berlaku di CSS",
            "Karena memperlambat rendering gambar"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b6_p3",
          q: "CORS (Cross-Origin Resource Sharing) dikendalikan terutama melalui...",
          options: [
            "Header respons HTTP dari server (seperti Access-Control-Allow-Origin)",
            "File hosts pada sistem operasi",
            "Pengaturan kecerahan layar",
            "Tag <meta charset>",
            "Alamat MAC router"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b6_m1",
          q: "Apa risiko jika server mengembalikan `Access-Control-Allow-Origin: <origin_dari_request>` secara membabi buta dengan `Access-Control-Allow-Credentials: true`?",
          options: [
            "Situs eksternal berbahaya dapat membaca respons sensitif lintas origin dalam konteks kredensial pengguna",
            "Server tidak dapat menerima permintaan POST",
            "Browser mematikan koneksi Wi-Fi",
            "Database terhapus otomatis",
            "Token JWT menjadi kadaluwarsa seketika"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b6_m2",
          q: "Kerentanan 'Excessive Data Exposure' terjadi ketika API...",
          options: [
            "Mengirimkan atribut objek yang berlebihan/sensitif ke klien dan menyerahkan penyaringan ke UI",
            "Menggunakan format JSON",
            "Mengompres data dengan gzip",
            "Membatasi ukuran halaman menjadi 10 item",
            "Menggunakan status kode 200"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b6_h1",
          q: "Untuk memverifikasi keaslian payload webhook dari penyedia eksternal agar tidak dipalsukan pihak ketiga, mekanisme yang tepat adalah...",
          options: [
            "Memeriksa header tanda tangan HMAC menggunakan shared secret dan perbandingan waktu konstan (timing-safe)",
            "Mengandalkan kerahasiaan URL webhook saja",
            "Mengizinkan semua IP tanpa autentikasi",
            "Mengirim secret di query string URL tanpa TLS",
            "Menonaktifkan validasi timestamp"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  },
  {
    id: 7,
    name: "7. Gudang Arsip & Upload (File Fortress)",
    topic: "File Upload & Path Traversal",
    color: "#14b8a6",
    position: [-6, 0, 8],
    height: 5.2,
    levels: {
      pemula: [
        {
          id: "b7_p1",
          q: "Apa bahaya utama jika file skrip yang dapat dieksekusi diunggah ke direktori web yang dapat diakses publik?",
          options: [
            "Potensi eksekusi kode jarak jauh (Remote Code Execution)",
            "Warna gambar berubah menjadi hitam putih",
            "Ukuran font menjadi lebih kecil",
            "Cache browser menjadi kosong",
            "Koneksi HTTPS terputus"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b7_p2",
          q: "Urutan karakter seperti `../` yang dipakai untuk keluar dari direktori tujuan disebut...",
          options: [
            "Path / Directory Traversal",
            "Load Balancing",
            "Data Normalization",
            "Key Rotation",
            "Session Timeout"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b7_p3",
          q: "Mengapa header `Content-Type` pada upload tidak bisa dijadikan satu-satunya acuan keamanan?",
          options: [
            "Karena nilai header dapat dimanipulasi oleh klien pengirim request",
            "Karena header tersebut tidak pernah ada pada HTTP",
            "Karena server mengabaikan semua header",
            "Karena hanya berlaku untuk file ZIP",
            "Karena membatasi ukuran file 1 KB"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b7_m1",
          q: "Praktik penyimpanan file unggahan yang lebih aman di antaranya adalah...",
          options: [
            "Mengganti nama file dengan identifier acak, memvalidasi tipe/isi file, dan menyimpan di storage terpisah non-eksekusi",
            "Mempertahankan nama file asli apa adanya di folder root web",
            "Mengizinkan semua ekstensi selama ukurannya kecil",
            "Menyimpan kredensial admin di dalam nama file",
            "Menonaktifkan pemeriksaan path"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b7_m2",
          q: "Mengapa file gambar SVG berpotensi menimbulkan masalah keamanan web?",
          options: [
            "Karena SVG berbasis XML dan dapat memuat elemen/skrip aktif jika tidak disanitasi atau disajikan dengan aman",
            "Karena SVG tidak memiliki dimensi piksel",
            "Karena SVG hanya bisa dibuka di editor teks",
            "Karena SVG selalu terenkripsi",
            "Karena SVG menghapus database"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b7_h1",
          q: "Bagaimana cara mencegah Path Traversal saat mengakses file berdasarkan nama yang diberikan pengguna?",
          options: [
            "Menyelesaikan path absolut/canonical dan memastikan hasilnya berada tepat di dalam direktori dasar yang diizinkan",
            "Menghapus karakter '/' hanya sekali di awal string",
            "Menggunakan eval() pada string path",
            "Memberikan izin chmod 777 pada seluruh folder",
            "Menyimpan path di cookie yang bisa diubah klien"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  },
  {
    id: 8,
    name: "8. Jaringan Internal Kota (SSRF Reactor)",
    topic: "SSRF & Request Forgery",
    color: "#f97316",
    position: [0, 0, 8],
    height: 5.8,
    levels: {
      pemula: [
        {
          id: "b8_p1",
          q: "Pada serangan SSRF (Server-Side Request Forgery), pihak mana yang melakukan permintaan jaringan ke target?",
          options: [
            "Server aplikasi itu sendiri atas perintah/input yang dikendalikan penyerang",
            "Router ISP rumah pengguna",
            "Server DNS akar internet",
            "Perangkat keras printer lokal",
            "Browser pengguna lain secara acak"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b8_p2",
          q: "Mengapa akses server ke alamat loopback atau layanan metadata internal berbahaya pada SSRF?",
          options: [
            "Karena layanan internal sering dipercaya dan dapat membocorkan data/kredensial sensitif",
            "Karena mempercepat koneksi internet publik",
            "Karena memperbaiki sertifikat SSL",
            "Karena menghapus log sistem",
            "Karena mengubah zona waktu server"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b8_p3",
          q: "Serangan CSRF (Cross-Site Request Forgery) memanfaatkan...",
          options: [
            "Pengiriman kredensial otomatis oleh browser (seperti cookie) pada permintaan lintas situs tanpa niat eksplisit pengguna",
            "Kelemahan algoritma SHA-512",
            "Kerusakan kipas pendingin server",
            "Kesalahan pengetikan URL di address bar",
            "Kapasitas RAM ponsel yang penuh"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b8_m1",
          q: "Mengapa pemblokiran berbasis string literal seperti `127.0.0.1` sering gagal menahan SSRF?",
          options: [
            "Karena alamat yang sama dapat direpresentasikan secara berbeda (misalnya localhost, IPv6 ::1, bentuk numerik lain, atau redirect)",
            "Karena angka tidak bisa dicocokkan dengan kondisi",
            "Karena server mengabaikan alamat IP",
            "Karena protokol HTTP tidak mendukung IP",
            "Karena DNS tidak menerjemahkan nama host"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b8_m2",
          q: "Kontrol pertahanan yang efektif terhadap CSRF pada aplikasi berbasis cookie adalah...",
          options: [
            "Token anti-CSRF yang tidak dapat ditebak per sesi/aksi serta konfigurasi SameSite cookie yang tepat",
            "Menampilkan pesan peringatan di console",
            "Menggunakan metode GET untuk mengubah data sensitif",
            "Menghapus atribut HttpOnly",
            "Menonaktifkan HTTPS"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b8_h1",
          q: "Bagaimana 'DNS Rebinding' dapat melewati validasi IP publik yang dilakukan sebelum permintaan HTTP keluar?",
          options: [
            "Nama domain awalnya mengarah ke IP publik saat dicek, lalu berubah ke IP internal pada permintaan berikutnya karena TTL singkat",
            "DNS Rebinding mengubah port menjadi 22 secara otomatis",
            "DNS Rebinding menonaktifkan firewall klien",
            "DNS Rebinding mengenkripsi paket UDP menjadi TCP",
            "DNS Rebinding menghapus tabel routing lokal"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  },
  {
    id: 9,
    name: "9. Pabrik Rantai Pasok (Supply Chain)",
    topic: "Supply Chain & Dependency Security",
    color: "#6366f1",
    position: [6, 0, 8],
    height: 4.7,
    levels: {
      pemula: [
        {
          id: "b9_p1",
          q: "Apa yang dimaksud dengan kerentanan pada komponen pihak ketiga / dependensi?",
          options: [
            "Celah keamanan yang ada pada pustaka, paket, atau modul eksternal yang digunakan aplikasi",
            "Kesalahan desain tata letak tombol",
            "Kabel jaringan yang terputus",
            "Layar ponsel yang retak",
            "Pengaturan bahasa sistem operasi"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b9_p2",
          q: "Apa peran file lock (seperti `package-lock.json`) dalam manajemen dependensi?",
          options: [
            "Mencatat versi pasti dan informasi integritas paket yang terpasang agar build konsisten",
            "Mengompres seluruh folder node_modules menjadi satu file biner",
            "Menghapus semua dependensi saat deploy",
            "Mengganti fungsi autentikasi pengguna",
            "Menyimpan password admin"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b9_p3",
          q: "Typosquatting pada ekosistem paket perangkat lunak terjadi ketika...",
          options: [
            "Penyerang mempublikasikan paket berbahaya dengan nama yang mirip kesalahan ketik nama paket populer",
            "Pengembang memperbarui versi minor pustaka",
            "Server CI/CD menjalankan unit test",
            "Dokumentasi API ditulis dalam bahasa Inggris",
            "Cache lokal dibersihkan"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b9_m1",
          q: "Apa yang dimaksud dengan 'Dependency Confusion'?",
          options: [
            "Paket publik dengan nama sama seperti paket internal privat diambil oleh resolver karena versi lebih tinggi atau urutan sumber",
            "Dua fungsi memiliki nama parameter berbeda",
            "Dependensi tidak dapat diunduh karena ukuran besar",
            "Penggunaan dua bahasa pemrograman sekaligus",
            "Kesalahan sintaks pada file JSON"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b9_m2",
          q: "Apa fungsi utama SBOM (Software Bill of Materials)?",
          options: [
            "Daftar inventaris komponen, pustaka, dan dependensi beserta hubungannya dalam suatu perangkat lunak",
            "Laporan tagihan biaya listrik server",
            "Skrip otomatis untuk menghapus basis data",
            "Panduan desain antarmuka pengguna",
            "Sertifikat kelulusan mahasiswa"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b9_h1",
          q: "Bagaimana Subresource Integrity (SRI) melindungi pemuatan skrip eksternal dari CDN?",
          options: [
            "Browser menghitung hash dari konten skrip yang diunduh dan membandingkannya dengan hash yang diharapkan sebelum mengeksekusi",
            "SRI memblokir seluruh permintaan HTTPS ke CDN",
            "SRI menjalankan skrip di dalam database",
            "SRI memperbarui versi skrip secara otomatis tanpa persetujuan",
            "SRI mengubah format skrip menjadi gambar"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  },
  {
    id: 10,
    name: "10. Pusat Komando SOC (Logging & SDLC)",
    topic: "Security Logging, Testing & DevSecOps",
    color: "#06b6d4",
    position: [12, 0, 8],
    height: 6.5,
    levels: {
      pemula: [
        {
          id: "b10_p1",
          q: "Mengapa pencatatan log peristiwa keamanan (seperti upaya login gagal) penting?",
          options: [
            "Membantu deteksi aktivitas mencurigakan, pemantauan insiden, dan analisis forensik",
            "Mempercepat kecepatan clock prosesor",
            "Menggantikan kebutuhan enkripsi data",
            "Menghapus bug sintaks secara otomatis",
            "Menambah kapasitas penyimpanan disk"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b10_p2",
          q: "Data manakah yang TIDAK boleh dicatat ke dalam log aplikasi?",
          options: [
            "Password plain-text, secret token, atau data rahasia sensitif",
            "Timestamp kejadian",
            "Status kode HTTP",
            "Identifier kejadian non-rahasia",
            "Nama modul sistem"
          ],
          answer: 0,
          points: 1
        },
        {
          id: "b10_p3",
          q: "Apa makna praktis dari 'Shift-Left Security' dalam pengembangan perangkat lunak?",
          options: [
            "Menerapkan analisis keamanan dan threat modeling sejak tahap awal siklus pengembangan",
            "Menunda pengujian keamanan hingga setelah rilis publik",
            "Memindahkan seluruh server ke zona waktu barat",
            "Menghapus tahap pengujian kode",
            "Mengandalkan keberuntungan saat produksi"
          ],
          answer: 0,
          points: 1
        }
      ],
      menengah: [
        {
          id: "b10_m1",
          q: "Apa perbedaan utama antara SAST dan DAST?",
          options: [
            "SAST menganalisis kode sumber/bytecode secara statis; DAST menguji aplikasi berjalan dari sisi luar/dinamis",
            "SAST hanya untuk database, DAST hanya untuk CSS",
            "DAST tidak memerlukan aplikasi yang berjalan",
            "SAST selalu menggantikan audit manusia",
            "Tidak ada perbedaan antara keduanya"
          ],
          answer: 0,
          points: 2
        },
        {
          id: "b10_m2",
          q: "Kerentanan 'Log Injection' dapat terjadi ketika...",
          options: [
            "Input pengguna yang mengandung karakter kontrol/baris baru tidak disanitasi sebelum ditulis ke log sehingga memalsukan entri log",
            "Ukuran file log terlalu kecil",
            "Log ditulis menggunakan format UTF-8",
            "Sistem mencatat waktu UTC",
            "Administrator membaca file log"
          ],
          answer: 0,
          points: 2
        }
      ],
      mahir: [
        {
          id: "b10_h1",
          q: "Mengapa penyimpanan log keamanan pada sistem terpusat/terproteksi (append-only / terpisah dari server aplikasi) sangat krusial saat terjadi kompromi?",
          options: [
            "Agar penyerang yang menguasai server aplikasi tidak dapat dengan mudah menghapus atau memalsukan jejak audit",
            "Agar log bisa diedit bebas oleh semua pengguna",
            "Agar ukuran log menjadi 0 byte",
            "Agar aplikasi tidak perlu melakukan autentikasi",
            "Agar browser dapat menghapus riwayat lokal"
          ],
          answer: 0,
          points: 3
        }
      ]
    }
  }
];

export const MAX_TOTAL_SCORE = 100;
export const MAX_WRONG_ATTEMPTS_PER_BUILDING = 3;

export function getSafeBuildingsForClient() {
  return BUILDINGS_DATA.map((b) => ({
    id: b.id,
    name: b.name,
    topic: b.topic,
    color: b.color,
    position: b.position,
    height: b.height,
    levels: {
      pemula: b.levels.pemula.map(({ id, q, options, points }) => ({ id, q, options, points })),
      menengah: b.levels.menengah.map(({ id, q, options, points }) => ({ id, q, options, points })),
      mahir: b.levels.mahir.map(({ id, q, options, points }) => ({ id, q, options, points })),
    },
  }));
}
