// === FUNGSI MENU ===
function bukaMenu() { document.getElementById("menuSamping").classList.add("buka"); document.getElementById("lapisanGelap").classList.add("aktif"); }
function tutupMenu() { document.getElementById("menuSamping").classList.remove("buka"); document.getElementById("lapisanGelap").classList.remove("aktif"); }

// === 🔑 SISTEM LOGIN ADMIN (LENGKAP & BERFUNGSI) ===
window.onload = function() {
    // 🔄 PULIHKAN DATA DARI CADANGAN (JIKA ADA)
    pulihkanDataCadangan();

    // 🔐 BUAT AKUN ADMIN OTOMATIS KALAU BELUM ADA
    let daftarAkun = JSON.parse(localStorage.getItem('daftarAkunTerdaftar')) || [];
    if (!daftarAkun.some(akun => akun.nama === "admin")) {
        daftarAkun.push({nama: "admin", sandi: "admin123", peran: "admin"});
        localStorage.setItem('daftarAkunTerdaftar', JSON.stringify(daftarAkun));
        localStorage.setItem('akunLogin', JSON.stringify(daftarAkun));
    }

    // 🚫 SEMBUNYIKAN SEMUA ISI ADMIN SEBELUM LOGIN
    document.querySelector('.menu-samping').style.display = 'none';
    document.querySelector('.header').style.display = 'none';
    document.querySelector('.main-container').style.display = 'none';

    // 📊 MUAT SEMUA DATA SISTEM
    tampilkanSemuaAkun();
    tampilkanKegiatan();
    tampilkanMedia();
    muatDataTersimpan();
    tampilkanSaran(); // ✅ SUDAH BENAR SEPERTI DI GAMBAR KAMU
};

// Fungsi Cek Login
function cekLoginAdmin() {
    const nama = document.getElementById('namaAdmin').value.trim();
    const sandi = document.getElementById('sandiAdmin').value.trim();
    const daftarAkun = JSON.parse(localStorage.getItem('daftarAkunTerdaftar')) || [];

    // Cari apakah yang login adalah ADMIN
    const adminValid = daftarAkun.find(a => a.nama === nama && a.sandi === sandi && a.peran === "admin");

    if (adminValid) {
        // ✅ BERHASIL MASUK
        alert("✅ Selamat Datang Admin!");
        localStorage.setItem('sudahLogin', 'true');
        localStorage.setItem('peranPengguna', 'admin');

        // Sembunyikan Layar Login
        document.getElementById('layaranLogin').style.display = 'none';
        
        // ✅ TAMPILKAN SEMUA ISI HALAMAN
        document.querySelector('.menu-samping').style.display = 'block';
        document.querySelector('.header').style.display = 'block';
        document.querySelector('.main-container').style.display = 'block';

        // Muat semua data setelah masuk
        tampilkanSemuaAkun();
        tampilkanKegiatan();
        tampilkanMedia();
        muatDataTersimpan();
        document.getElementById('fileInput').addEventListener('change', pratinjauFile);

    } else {
        // ❌ GAGAL LOGIN
        alert("❌ AKSES DITOLAK! \nHanya Admin yang boleh masuk. \nNama atau Sandi salah.");
    }
}

// === GANTI MENU TAB ===
function gantiTab(namaTab) {
    document.querySelectorAll('.konten-tab').forEach(e => e.style.display = 'none');
    document.querySelectorAll('.nav-btn').forEach(e => e.classList.remove('aktif'));
    document.getElementById('konten-' + namaTab).style.display = 'block';
    
    let judul = "";
    if(namaTab === 'akun') judul = "KELOLA AKUN PENGGUNA";
    if(namaTab === 'profil') judul = "UBAH ALAMAT & KONTAK";
    if(namaTab === 'tentang') judul = "UBAH ISI HALAMAN TENTANG";
    if(namaTab === 'kegiatan') judul = "KELOLA AGENDA & KEGIATAN";
    if(namaTab === 'media') judul = "KELOLA GALERI: FOTO & VIDEO";
    if(namaTab === 'pengaturan') judul = "PENGATURAN SISTEM";
    if(namaTab === 'saran') judul = "KOTAK MASUKAN & SARAN"
    document.getElementById('judulUtama').innerText = judul;
}


// ==============================================
// BAGIAN AKUN (BISA TAMBAH, HAPUS, & LOGIN)
// ==============================================
function tambahAkun() {
    const nama = document.getElementById('namaBaru').value.trim();
    const sandi = document.getElementById('sandiBaru').value.trim();
    const peran = document.getElementById('peranBaru').value;
    if(!nama || !sandi) return alert("⚠️ Isi lengkap!");
    if(nama.toLowerCase() === "admin") return alert("❌ Nama 'admin' sudah ada & dilindungi!");

    let daftar = JSON.parse(localStorage.getItem('daftarAkunTerdaftar')) || [];
    if(daftar.some(a => a.nama === nama)) return alert("❌ Nama sudah dipakai!");

    daftar.push({nama, sandi, peran});
    localStorage.setItem('daftarAkunTerdaftar', JSON.stringify(daftar));
    
    // Sambungkan ke halaman login biasa
    localStorage.setItem('akunLogin', JSON.stringify(daftar));

    document.getElementById('namaBaru').value = ""; document.getElementById('sandiBaru').value = "";
    tampilkanSemuaAkun();
    alert("✅ Akun berhasil dibuat & bisa login di halaman depan!");
}

function tampilkanSemuaAkun() {
    const daftar = JSON.parse(localStorage.getItem('daftarAkunTerdaftar')) || [];
    const wadah = document.getElementById('daftarAkun'); wadah.innerHTML = "";
    daftar.forEach((akun, i) => {
        const li = document.createElement('li'); li.className = "item-akun";
        
        if(akun.nama === "admin") {
            li.style.background = "rgba(22, 163, 74, 0.15)";
            li.style.borderColor = "#16A34A";
            li.innerHTML = `<span><strong>🔒 ${akun.nama}</strong> <em>(ADMIN UTAMA - Terkunci)</em></span><span style="color:#16A34A;">AMAN</span>`;
        } else {
            li.innerHTML = `<span><strong>${akun.nama}</strong> <em>(${akun.peran})</em></span><button class="btn-hapus" onclick="hapusAkun(${i})">🗑️ Hapus</button>`;
        }
        wadah.appendChild(li);
    });
}

function hapusAkun(urutan) {
    if(!confirm("Yakin hapus akun ini? Tidak bisa dikembalikan!")) return;
    
    let daftar = JSON.parse(localStorage.getItem('daftarAkunTerdaftar')) || [];
    if(daftar[urutan].nama === "admin") return alert("❌ Tidak boleh hapus Admin Utama!");
    
    daftar.splice(urutan, 1);
    localStorage.setItem('daftarAkunTerdaftar', JSON.stringify(daftar));
    localStorage.setItem('akunLogin', JSON.stringify(daftar)); // Perbarui daftar login
    tampilkanSemuaAkun();
    alert("✅ Akun berhasil dihapus!");
}


// ==============================================
// BAGIAN ALAMAT, TENTANG, KEGIATAN
// ==============================================
function simpanAlamat() { 
    localStorage.setItem('alamatDesa', document.getElementById('isiAlamat').value); 
    alert("✅ Alamat Disimpan!"); 
}
function simpanKontak() { 
    localStorage.setItem('telpDesa', document.getElementById('isiTelepon').value); 
    localStorage.setItem('emailDesa', document.getElementById('isiEmail').value); 
    localStorage.setItem('mapsDesa', document.getElementById('isiMaps').value); 
    alert("✅ Kontak Disimpan!"); 
}
function simpanTentang() { 
    localStorage.setItem('judulTentang', document.getElementById('judulTentang').value); 
    localStorage.setItem('isiTentang', document.getElementById('isiTentang').value); 
    alert("✅ Halaman Tentang Diperbarui!"); 
}
function tambahKegiatan() {
    const daftar = JSON.parse(localStorage.getItem('daftarKegiatan')) || [];
    daftar.push({
        nama:document.getElementById('namaKegiatan').value,
        tanggal:document.getElementById('tanggalKegiatan').value,
        jenis:document.getElementById('jenisKegiatan').value,
        isi:document.getElementById('deskripsiKegiatan').value
    });
    localStorage.setItem('daftarKegiatan', JSON.stringify(daftar));
    alert("✅ Kegiatan Ditambahkan!"); location.reload();
}
function tampilkanKegiatan() {
    const daftar = JSON.parse(localStorage.getItem('daftarKegiatan')) || [];
    const wadah = document.getElementById('daftarKegiatan'); wadah.innerHTML = "";
    daftar.forEach((keg, i) => {
        const li = document.createElement('li'); li.className = "item-akun";
        li.innerHTML = `<span><strong>${keg.nama}</strong> <em>(${keg.tanggal} - ${keg.jenis})</em><br><small>${keg.isi}</small></span><button class="btn-hapus" onclick="hapusKegiatan(${i})">🗑️</button>`;
        wadah.appendChild(li);
    });
}
function hapusKegiatan(i) { 
    let d=JSON.parse(localStorage.getItem('daftarKegiatan'))||[]; d.splice(i,1); localStorage.setItem('daftarKegiatan',JSON.stringify(d)); tampilkanKegiatan(); 
}
function simpanNamaAplikasi() { 
    localStorage.setItem('namaAplikasi', document.getElementById('namaAplikasi').value || "KAMPOENG AING"); alert("✅ Nama Diubah!"); 
}
function muatDataTersimpan() {
    document.getElementById('isiAlamat').value = localStorage.getItem('alamatDesa') || "";
    document.getElementById('isiTelepon').value = localStorage.getItem('telpDesa') || "";
    document.getElementById('isiEmail').value = localStorage.getItem('emailDesa') || "";
    document.getElementById('isiMaps').value = localStorage.getItem('mapsDesa') || "";
    document.getElementById('judulTentang').value = localStorage.getItem('judulTentang') || "";
    document.getElementById('isiTentang').value = localStorage.getItem('isiTentang') || "";
    document.getElementById('namaAplikasi').value = localStorage.getItem('namaAplikasi') || "KAMPOENG AING";
}


// ==============================================
// ✅ FITUR UPLOAD & HAPUS FOTO / VIDEO
// ==============================================
let fileTerpilih;
function pratinjauFile(e) {
    const wadah = document.getElementById('pratinjauMedia');
    fileTerpilih = e.target.files[0];
    if(!fileTerpilih) return;

    const reader = new FileReader();
    reader.onload = function(event) {
        wadah.innerHTML = "";
        if(fileTerpilih.type.includes('image')) {
            wadah.innerHTML = `<img src="${event.target.result}" style="max-height:150px; border-radius:6px;">`;
        }
        if(fileTerpilih.type.includes('video')) {
            wadah.innerHTML = `<video src="${event.target.result}" controls style="max-height:150px; border-radius:6px;"></video>`;
        }
    }
    reader.readAsDataURL(fileTerpilih);
}

function unggahMedia() {
    if(!fileTerpilih) return alert("❌ Pilih file dulu!");
    const judul = document.getElementById('judulMedia').value || "Tanpa Judul";
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const daftar = JSON.parse(localStorage.getItem('galeriMedia')) || [];
        daftar.push({
            judul: judul,
            tipe: fileTerpilih.type,
            data: e.target.result
        });
        localStorage.setItem('galeriMedia', JSON.stringify(daftar));
        alert("✅ File Berhasil Diunggah ke Galeri!");
        document.getElementById('fileInput').value = "";
        document.getElementById('judulMedia').value = "";
        document.getElementById('pratinjauMedia').innerHTML = '<i class="fa fa-image"></i> <span>Pilih file untuk melihat pratinjau</span>';
        tampilkanMedia();
    }
    reader.readAsDataURL(fileTerpilih);
}

function tampilkanMedia() {
    const daftar = JSON.parse(localStorage.getItem('galeriMedia')) || [];
    const wadah = document.getElementById('daftarMedia');
    wadah.innerHTML = "";

    if (daftar.length === 0) { 
    wadah.innerHTML = "<p style='color:#9CA3AF; text-align:center; padding:2rem;'>Belum ada file media yang diunggah.</p>";
}

daftar.forEach((item, i) => {
    const kartu = document.createElement('div');
    // ✅ Perbaiki gaya: ambil nilai variabel CSS atau tulis warna langsung
    kartu.style.backgroundColor = '#1F2937'; // var(--warna-abu-gelap)
    kartu.style.border = '1px solid #4B5563'; // var(--warna-batas)
    kartu.style.borderRadius = '8px';
    kartu.style.padding = '0.5rem';
    kartu.style.position = 'relative';
    kartu.style.marginBottom = '0.8rem'; // biar ada jarak antar kartu

    let tampilan = "";
    // ✅ Lengkapi tag gambar dan video
    if (item.tipe.includes('image')) {
        tampilan = `<img src="${item.data}" style="width:100%; height:auto; border-radius:4px;">`;
    }
    if (item.tipe.includes('video')) {
        tampilan = `<video src="${item.data}" controls style="width:100%; height:auto; border-radius:4px;"></video>`;
    }

    // ✅ Lengkapi isi kartu
    kartu.innerHTML = `
        ${tampilan}
        <div style="padding:0.5rem 0; font-weight:500; font-size:0.9rem; color:#F3F4F6;">
            ${item.nama || 'File Tidak Bernama'}
        </div>
        <button class="btn-hapus" onclick="hapusMedia(${i})" style="position:absolute; top:0.5rem; right:0.5rem; background:#DC2626; color:white; border:none; border-radius:4px; padding:0.2rem 0.5rem; cursor:pointer;">
            Hapus
        </button>
    `;

    wadah.appendChild(kartu);
});
function hapusMedia(urutan) {
    if (!confirm("Yakin mau hapus file ini? Tidak bisa dikembalikan!")) {
        return; // ❌ Jika klik Batal, hentikan proses
    }

    const daftar = JSON.parse(localStorage.getItem('galeriMedia')) || [];
    daftar.splice(urutan, 1); // Hapus data di urutan tertentu
    localStorage.setItem('galeriMedia', JSON.stringify(daftar));

    tampilkanMedia(); // Muat ulang tampilan
    // ==================================================
// ✅ 1. BAGIAN KOTAK MASUKAN & SARAN (LENGKAP)
// ==================================================
function tampilkanSaran() {
    const daftar = JSON.parse(localStorage.getItem('kotakSaranAdmin')) || [];
    const wadah = document.getElementById('daftarSaran');
    wadah.innerHTML = "";

    if (daftar.length === 0) {
        wadah.innerHTML = `
        <div style="text-align:center; padding:3rem 1rem; color:#94A3B8; font-style:italic;">
            <i class="fa fa-inbox" style="font-size:3rem; opacity:0.3; margin-bottom:1rem;"></i>
            <p>Belum ada pesan atau masukan yang masuk.</p>
        </div>`;
        return;
    }

    daftar.forEach((pesan, indeks) => {
        const kotakPesan = document.createElement('div');
        kotakPesan.style.background = "rgba(245, 158, 11, 0.08)";
        kotakPesan.style.border = "1px solid rgba(245, 158, 11, 0.2)";
        kotakPesan.style.padding = "1.2rem";
        kotakPesan.style.borderRadius = "0.8rem";
        kotakPesan.style.marginBottom = "1rem";
        kotakPesan.style.backdropFilter = "blur(4px)";

        kotakPesan.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.5rem;">
                <div>
                    <strong style="color:#F59E0B; font-size:1.05rem;">
                        <i class="fa fa-user-circle"></i> ${pesan.nama}
                    </strong>
                    <small style="color:#94A3B8; margin-left:0.8rem;">
                        <i class="fa fa-clock-o"></i> ${pesan.waktu}
                    </small>
                </div>
                <button onclick="hapusSaran(${indeks})" style="
                    background:#DC2626; color:white; border:none; padding:0.3rem 0.7rem; 
                    border-radius:0.4rem; font-size:0.8rem; cursor:pointer;
                    transition: all 0.2s;
                " onmouseover="this.style.background='#EF4444'" onmouseout="this.style.background='#DC2626'">
                    <i class="fa fa-trash"></i> Hapus
                </button>
            </div>
            <p style="margin:0; color:#E2E8F0; line-height:1.6; padding:0.5rem 0 0 0;">
                ${pesan.pesan}
            </p>
        `;
        wadah.appendChild(kotakPesan);
    });
}

function hapusSaran(indeksYangDihapus) {
    if(confirm("Yakin ingin menghapus pesan ini?\nTindakan ini tidak bisa dibatalkan.")) {
        let daftar = JSON.parse(localStorage.getItem('kotakSaranAdmin')) || [];
        daftar.splice(indeksYangDihapus, 1);
        localStorage.setItem('kotakSaranAdmin', JSON.stringify(daftar));
        tampilkanSaran();
    }
}

// ==================================================
// ✅ 2. BAGIAN KEAMANAN: CEGAH DATA HILANG SAAT REFRESH
// ==================================================
// (Sudah saya tambahkan ini supaya akun & pesan tidak hilang saat halaman di-refresh)
window.addEventListener('beforeunload', function() {
    // Simpan cadangan data akun
    let dataAkun = localStorage.getItem('daftarAkunTerdaftar');
    if(dataAkun) localStorage.setItem('cadanganAkun', dataAkun);
    
    // Simpan cadangan data saran
    let dataSaran = localStorage.getItem('kotakSaranAdmin');
    if(dataSaran) localStorage.setItem('cadanganSaran', dataSaran);
});

// ==================================================
// ✅ 3. BAGIAN PEMULIHAN DATA (JIKA TERHAPUS TIDAK SENGAJA)
// ==================================================
// (Otomatis mengembalikan data dari cadangan kalau hilang)
function pulihkanDataCadangan() {
    // Pulihkan Data AKUN
    if (!localStorage.getItem('daftarAkunTerdaftar') && localStorage.getItem('cadanganAkun')) {
        localStorage.setItem('daftarAkunTerdaftar', localStorage.getItem('cadanganAkun'));
        localStorage.setItem('akunLogin', localStorage.getItem('cadanganAkun'));
    }

    // Pulihkan Data SARAN
    if (!localStorage.getItem('kotakSaranAdmin') && localStorage.getItem('cadanganSaran')) {
        localStorage.setItem('kotakSaranAdmin', localStorage.getItem('cadanganSaran'));
    }
}
}
}