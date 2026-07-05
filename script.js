 
        function switchView(viewId) {
            document.querySelectorAll('.page-container').forEach(page => page.classList.remove('active-page'));
            document.getElementById(viewId).classList.add('active-page');
            window.scrollTo({ top: 0, behavior: 'smooth' }); // يرجعك لأول الصفحة لما تبدل بين الصفحات
        }

        function enterPlatform(mode) {
            document.getElementById('bg-overlay').classList.add('dark-mode');
            switchView('view-home');
            const studyCard = document.getElementById('card-study');
            const examCards = document.querySelectorAll('.card-exam');
            const subtitle = document.getElementById('dashboard-subtitle');

            if (mode === 'learn') {
                subtitle.innerText = "Learning Mode Active";
                studyCard.style.display = 'flex';
                examCards.forEach(card => card.style.display = 'none');
            } else if (mode === 'battle') {
                subtitle.innerText = "Battle Mode Active";
                studyCard.style.display = 'none';
                examCards.forEach(card => card.style.display = 'flex');
            }
        }

        function goHome() {
            document.getElementById('bg-overlay').classList.remove('dark-mode');
            switchView('view-landing');
        }

        function toggleAccordion(header) {
            const item = header.parentElement;
            const allItems = document.querySelectorAll('.accordion-item');
            allItems.forEach(i => { if (i !== item) i.classList.remove('active'); });
            item.classList.toggle('active');
        }

        const midtermQuestions = [{ q: "اكتب السؤال الأول للميدتيرم هنا؟", c: ["الاختيار الأول", "الاختيار الثاني", "الاختيار الثالث", "الاختيار الرابع"], a: 0, exp: "الشرح هنا" }];
        const lastYearQuestions = [{ q: "اكتب سؤال العام الماضي هنا؟", c: ["الاختيار الأول", "الاختيار الثاني", "الاختيار الثالث", "الاختيار الرابع"], a: 2, exp: "الشرح هنا" }];
        const generalQuestions = [{ q: "اكتب سؤال الكويز العام هنا؟", c: ["الاختيار الأول", "الاختيار الثاني", "الاختيار الثالث", "الاختيار الرابع"], a: 1, exp: "الشرح هنا" }];
        const comprehensiveQuestions = [{ q: "اكتب سؤال الاختبار الشامل هنا؟", c: ["الاختيار الأول", "الاختيار الثاني", "الاختيار الثالث", "الاختيار الرابع"], a: 3, exp: "الشرح هنا" }];

        let activeQuiz = [];
        let currentIndex = 0;
        let correctAnswers = 0;
        let wrongAnswers = 0;
        let hasAnswered = false;

        function startQuiz(type) {
            if (type === 'midterm') { activeQuiz = midtermQuestions; document.getElementById('quiz-title').innerText = "الميدتيرم"; }
            else if (type === 'lastYear') { activeQuiz = lastYearQuestions; document.getElementById('quiz-title').innerText = "العام الماضي"; }
            else if (type === 'general') { activeQuiz = generalQuestions; document.getElementById('quiz-title').innerText = "بنك الكويز"; }
            
            currentIndex = 0; correctAnswers = 0; wrongAnswers = 0;
            switchView('view-quiz');
            renderQuestion();
        }

        function startComprehensiveQuiz() {
            activeQuiz = comprehensiveQuestions; 
            currentIndex = 0; correctAnswers = 0; wrongAnswers = 0;
            document.getElementById('quiz-title').innerText = "الاختبار الشامل";
            switchView('view-quiz'); 
            renderQuestion(); 
        }

        function renderQuestion() {
            hasAnswered = false;
            document.getElementById('btn-next').style.display = 'none';
            document.getElementById('explanation-box').style.display = 'none';
            
            document.getElementById('val-correct').innerText = correctAnswers;
            document.getElementById('val-wrong').innerText = wrongAnswers;
            document.getElementById('val-remain').innerText = activeQuiz.length - currentIndex;
            
            let progress = (currentIndex / activeQuiz.length) * 100;
            document.getElementById('progress-bar').style.width = progress + '%';

            let currentQ = activeQuiz[currentIndex];
            if(!currentQ) return; 
            
            document.getElementById('question-text').innerText = `${currentIndex + 1}. ${currentQ.q}`;
            let container = document.getElementById('options-container');
            container.innerHTML = '';
            
            currentQ.c.forEach((choice, index) => {
                let btn = document.createElement('button');
                btn.className = 'option-btn';
                btn.innerText = choice;
                btn.onclick = () => checkAnswer(index, btn);
                container.appendChild(btn);
            });
        }

        function checkAnswer(selectedIndex, clickedBtn) {
            if (hasAnswered) return;
            hasAnswered = true;
            let currentQ = activeQuiz[currentIndex];
            let buttons = document.querySelectorAll('.option-btn');
            buttons.forEach(btn => btn.disabled = true);

            if (selectedIndex === currentQ.a) {
                clickedBtn.classList.add('correct-ans'); 
                correctAnswers++;
            } else {
                clickedBtn.classList.add('wrong-ans'); 
                buttons[currentQ.a].classList.add('correct-ans'); 
                wrongAnswers++;
            }
            
            document.getElementById('val-correct').innerText = correctAnswers;
            document.getElementById('val-wrong').innerText = wrongAnswers;
            
            let expBox = document.getElementById('explanation-box');
            expBox.innerHTML = `<strong>إضاءة:</strong> ${currentQ.exp || "الإجابة الصحيحة مظللة بالأخضر"}`;
            expBox.style.display = 'block';
            
            document.getElementById('btn-next').style.display = 'block';
        }

        function processNext() {
            currentIndex++;
            if (currentIndex < activeQuiz.length) { 
                renderQuestion(); 
            } else {
                document.getElementById('progress-bar').style.width = '100%';
                switchView('view-score');
                
                let percentage = Math.round((correctAnswers / activeQuiz.length) * 100) || 0;
                document.getElementById('score-value').innerText = percentage + '%';
                document.getElementById('score-fraction').innerText = `${correctAnswers} إجابات صحيحة من أصل ${activeQuiz.length}`;
                document.getElementById('score-circle').style.background = `conic-gradient(var(--neon-cyan) ${percentage}%, transparent 0%)`;
                
                if(percentage >= 50) fireConfetti(); 
            }
        }

        function fireConfetti() {
            var duration = 3000; 
            var end = Date.now() + duration;
            (function frame() {
                confetti({ particleCount: 4, angle: 60, spread: 55, origin: { x: 0 }, colors: ['#00e5ff', '#ff2a75', '#ffffff'] });
                confetti({ particleCount: 4, angle: 120, spread: 55, origin: { x: 1 }, colors: ['#00e5ff', '#ff2a75', '#ffffff'] });
                if (Date.now() < end) requestAnimationFrame(frame);
            }());
        }
    