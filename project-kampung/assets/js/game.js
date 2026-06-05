// Aturan Poin GLOBAL
const POIN_BENAR = 5;
const POIN_SALAH = -3;

// Variabel Game
let jenisGame = "";
let levelSekarang = 1;
let nomorSoal = 0;
let skor = 0;
let daftarSoal = [];
let kunciJawaban = [];

// Data Pengguna
const namaPengguna = localStorage.getItem("namaPengguna") || "Tamu";

function inisialisasiGame(tipe, dataSoal) {
    jenisGame = tipe;
    daftarSoal = dataSoal;
    bukaKunciLevel(1);
    muatPapanPeringkatGame();
}

function bukaLevel() {
    document.getElementById("halamanAwal").style.display = "none";
    document.getElementById("areaLevel").style.display = "block";
}

function bukaSoal(level) {
    if (document.getElementById(`level${level}`).classList.contains("terkunci")) {
        alert("Level ini belum terbuka! Selesaikan level sebelumnya dulu.");
        return;
    }

    levelSekarang = level;
    nomorSoal = 0;
    skorLevel = 0;

    document.getElementById("areaLevel").style.display = "none";
    document.getElementById("areaSoal").style.display = "block";

    tampilkanSoal();
}

function tampilkanSoal() {
    document.getElementById("pesanHasil").innerHTML = "";
    document.querySelectorAll(".pilihan").forEach(el => {
        el.classList.remove("benar", "salah");
        el.style.pointerEvents = "auto";
    });

    const soalSekarang = daftarSoal[nomorSoal];
    document.getElementById("teksSoal").innerText = soalSekarang.soal;
    document.getElementById("judulSoal").innerText = `Level ${levelSekarang} - Soal ${nomorSoal + 1}`;

    document.getElementById("pilA").innerText = soalSekarang.pilihan[0];
    document.getElementById("pilB").innerText = soalSekarang.pilihan[1];
    document.getElementById("pilC").innerText = soalSekarang.pilihan[2];
    document.getElementById("pilD").innerText = soalSekarang.pilihan[3];

    window.jawabanBenar = soalSekarang.jawaban;
}

function cekJawaban(el, idx) {
    const nilaiPilihan = idx;

    document.querySelectorAll(".pilihan").forEach(p => p.style.pointerEvents = "none");

    if (nilaiPilihan === jawabanBenar) {
        el.classList.add("benar");
        skor += POIN_BENAR;
        document.getElementById("pesanHasil").innerHTML = `✅ BENAR! +${POIN_BENAR} Poin<br>Lanjut ke soal berikutnya...`;

        setTimeout(() => {
            nomorSoal++;
            if (nomorSoal < daftarSoal.length) {
                tampilkanSoal();
            } else {
                selesaikanLevel();
            }
        }, 1000);

    } else {
        el.classList.add("salah");
        skor += POIN_SALAH;
        document.getElementById("pesanHasil").innerHTML = `❌ SALAH! ${POIN_SALAH} Poin<br>Coba jawab lagi.`;

        setTimeout(() => {
            el.classList.remove("salah");
            document.getElementById("pesanHasil").innerHTML = "";
            document.querySelectorAll(".pilihan").forEach(p => p.style.pointerEvents = "auto");
        }, 1500);
    }
}

function selesaikanLevel() {
    document.getElementById("areaSoal").style.display = "none";
    document.getElementById("areaLevel").style.display = "block";

    if (levelSekarang < 4) {
        bukaKunciLevel(levelSekarang + 1);
        alert(`🎉 Level ${levelSekarang} Selesai!\nTotal Poin Game: ${skor}\nLevel ${levelSekarang + 1} telah terbuka!`);
    } else {
        alert(`🏆 SELAMAT! Kamu menyelesaikan SEMUA LEVEL!\nTotal Poin Akhir: ${skor}`);
    }

    simpanPoinKePeringkatGame(namaPengguna, skor);
    muatPapanPeringkatGame();
}

function bukaKunciLevel(level) {
    const el = document.getElementById(`level${level}`);
    if (el) el.classList.remove("terkunci");
}

// SISTEM PERINGKAT TERPISAH
function simpanPoinKePeringkatGame(nama, poinTambah) {
    const kunciData = `dataPeringkat_${jenisGame}`;
    let dataGame = JSON.parse(localStorage.getItem(kunciData)) || [];
    const cari = dataGame.find(d => d.nama === nama);

    if (cari) {
        cari.poin += poinTambah;
        if(cari.poin < 0) cari.poin = 0;
    } else {
        let poinAwal = poinTambah < 0 ? 0 : poinTambah;
        dataGame.push({ nama: nama, poin: poinAwal });
    }

    dataGame.sort((a, b) => b.poin - a.poin);
    localStorage.setItem(kunciData, JSON.stringify(dataGame));
}

function muatPapanPeringkatGame() {
    const kunciData = `dataPeringkat_${jenisGame}`;
    const daftar = JSON.parse(localStorage.getItem(kunciData)) || [];
    const wadah = document.querySelector(".daftar-peringkat");
    wadah.innerHTML = "";

    const sepuluhBesar = daftar.slice(0, 10);

    if (sepuluhBesar.length === 0) {
        wadah.innerHTML = "<li style='text-align:center; color:#94A3B8; padding:1rem;'>Belum ada yang bermain. Jadilah yang pertama!</li>";
        return;
    }

    sepuluhBesar.forEach((org, i) => {
        let kelas = "";
        if (i === 0) kelas = "pertama";
        if (i === 1) kelas = "kedua";
        if (i === 2) kelas = "ketiga";

        wadah.innerHTML += `
        <li class="peringkat-item ${kelas}">
            <span class="nomor-urutan">${i + 1}</span>
            <span class="nama-pemain">${org.nama}</span>
            <span class="poin-pemain">${org.poin} Poin</span>
        </li>`;
    });
}

// FUNGSI BANTU UMUM
function cekLogin() {
    if (!localStorage.getItem("sudahLogin")) window.location.href = "../login.html";
}
function animasiLogo() {
    const teks = "KAMPOENG AING";
    let i = 0;
    const tampil = setInterval(() => {
        const el = document.getElementById("animasiLogo");
        if(el) el.textContent = teks.substring(0, i+1);
        i++;
        if (i >= teks.length) clearInterval(tampil);
    }, 150);
}
function bukaMenu() {
    document.getElementById("menuSamping").classList.add("buka");
    document.getElementById("lapisanGelap").classList.add("aktif");
}

function tutupMenu() {
    document.getElementById("menuSamping").classList.remove("buka");
    document.getElementById("lapisanGelap").classList.remove("aktif");
}