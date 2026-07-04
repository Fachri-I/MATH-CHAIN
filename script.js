let chain = [];
let finalAnswer = 0;
let currentStep = 0;
let speedMs = 1500; // Default
let blankMs = 200;  // Waktu layar berkedip kosong (0.2 detik)

// Update tampilan saat slider digit digeser
const digitSlider = document.getElementById('digit-slider');
const digitDisplay = document.getElementById('digit-display');
digitSlider.oninput = function() {
    digitDisplay.innerHTML = this.value;
}

// Update tampilan saat slider kecepatan digeser
const speedSlider = document.getElementById('speed-slider');
const speedDisplay = document.getElementById('speed-display');
speedSlider.oninput = function() {
    speedDisplay.innerHTML = this.value + 's';
}

function generateGame(totalSteps, maxNum) {
    chain = [];
    
    // Angka awalan (1 sampai maxNum)
    let num = Math.floor(Math.random() * maxNum) + 1;
    chain.push(num.toString());
    finalAnswer = num;

    for (let i = 0; i < totalSteps; i++) {
        // Hanya menggunakan Tambah dan Kurang
        let ops = ['+', '-'];
        let op = ops[Math.floor(Math.random() * 2)];
        let nextNum = 0;

        if (op === '+') {
            nextNum = Math.floor(Math.random() * maxNum) + 1;
            finalAnswer += nextNum;
        } else if (op === '-') {
            let limit = Math.min(finalAnswer, maxNum); 
            
            if (limit < 1) {
                op = '+';
                nextNum = Math.floor(Math.random() * maxNum) + 1;
                finalAnswer += nextNum;
            } else {
                nextNum = Math.floor(Math.random() * limit) + 1; 
                finalAnswer -= nextNum;
            }
        }
        
        chain.push(`${op} ${nextNum}`);
    }
    console.log("Kunci Jawaban:", finalAnswer); // Untuk contekan di console browser
}

function startChain() {
    // Ambil input Jumlah Angka
    let userSteps = parseInt(document.getElementById('step-count').value);
    if (isNaN(userSteps) || userSteps < 1) userSteps = 5;
    
    // Ambil nilai dari Slider Digit
    let digitCount = parseInt(document.getElementById('digit-slider').value);
    let maxNum = Math.pow(10, digitCount) - 1;

    // Ambil nilai dari Slider Kecepatan dan ubah ke milidetik
    let speedSeconds = parseFloat(document.getElementById('speed-slider').value);
    speedMs = speedSeconds * 1000;

    // Sembunyikan UI yang tidak perlu saat permainan berjalan
    document.getElementById('start-btn').style.display = 'none';
    document.getElementById('settings-area').style.display = 'none';
    document.getElementById('answer-area').style.display = 'none';
    document.getElementById('feedback').innerText = '';
    document.getElementById('user-answer').value = '';
    
    generateGame(userSteps, maxNum);
    currentStep = 0;
    
    showNextItem();
}

function showNextItem() {
    let display = document.getElementById('display-area');
    
    if (currentStep < chain.length) {
        display.innerText = chain[currentStep];
        
        setTimeout(() => {
            display.innerText = ""; // Jeda visual agar angka tidak menimpa begitu saja
            currentStep++;
            
            setTimeout(showNextItem, blankMs);
        }, speedMs);
        
    } else {
        // Permainan selesai, munculkan kotak input jawaban
        display.innerText = "?";
        document.getElementById('answer-area').style.display = 'block';
        document.getElementById('user-answer').focus();
    }
}

function checkAnswer(e) {
    e.preventDefault(); 
    
    let userAnswer = parseInt(document.getElementById('user-answer').value);
    let feedback = document.getElementById('feedback');
    
    if (userAnswer === finalAnswer) {
        feedback.innerHTML = `<span class="correct">Tepat Sekali! Jawabannya adalah ${finalAnswer}</span>`;
    } else {
        feedback.innerHTML = `<span class="wrong">Salah. Jawaban yang benar adalah ${finalAnswer}</span>`;
    }
    
    // Munculkan kembali pengaturan untuk game berikutnya
    document.getElementById('answer-area').style.display = 'none';
    document.getElementById('settings-area').style.display = 'block';
    document.getElementById('start-btn').style.display = 'inline-block';
    document.getElementById('start-btn').innerText = 'Main Lagi';
}

// Fungsi untuk mengganti tema Terang/Gelap
function toggleTheme() {
    const body = document.body;
    const themeBtn = document.getElementById('theme-toggle');
    
    // Menambah/menghapus class 'dark-mode' di tag <body>
    body.classList.toggle('dark-mode');
    
    // Ubah teks dan ikon pada tombol
    if (body.classList.contains('dark-mode')) {
        themeBtn.innerHTML = '☀️ Light Mode';
    } else {
        themeBtn.innerHTML = '🌙 Dark Mode';
    }
}
