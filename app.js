// QCM Maths Generator - Application JavaScript
// Générateur automatique de QCM mathématiques

class QCMApp {
    constructor() {
        this.questions = [];
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.timerInterval = null;
        this.selectedCategories = ['definition', 'calculation', 'property', 'interval'];
        
        this.init();
    }
    
    async init() {
        this.showLoading();
        await this.loadQuestions();
        this.hideLoading();
        this.bindEvents();
        this.showScreen('startScreen');
    }
    
    async loadQuestions() {
        try {
            // Charger les questions depuis le fichier JSON généré
            const response = await fetch('qcm-data/generated_questions.json');
            if (response.ok) {
                const data = await response.json();
                this.questions = data.questions || [];
            } else {
                // Questions par défaut si le fichier n'existe pas
                this.questions = this.getDefaultQuestions();
            }
        } catch (error) {
            console.log('Chargement depuis les questions par défaut');
            this.questions = this.getDefaultQuestions();
        }
        
        this.updateTotalQuestions();
    }
    
    getDefaultQuestions() {
        return [
            {
                'id': 'def_racine_1',
                'category': 'definition',
                'question': 'Quelle est la définition de √a ?',
                'options': [
                    '√a est le nombre positif qui a pour carré a',
                    '√a est le nombre négatif qui a pour carré a',
                    '√a peut être positif ou négatif',
                    '√a est toujours égal à a/2'
                ],
                'correct': 0,
                'explanation': '√a est par définition le nombre positif qui, élevé au carré, donne a.'
            },
            {
                'id': 'def_reels_1',
                'category': 'definition',
                'question': 'Comment note-t-on l\'ensemble des nombres réels ?',
                'options': ['ℕ', 'ℤ', 'ℚ', 'ℝ'],
                'correct': 3,
                'explanation': 'L\'ensemble des nombres réels est noté ℝ.'
            },
            {
                'id': 'sqrt_exact_1',
                'category': 'calculation',
                'question': 'Calculez √25',
                'options': ['4', '5', '6', '7'],
                'correct': 1,
                'explanation': '√25 = 5 car 5² = 25'
            },
            {
                'id': 'sqrt_simpl_1',
                'category': 'calculation',
                'question': 'Simplifiez √20',
                'options': ['2√5', '4√5', '√10', '10'],
                'correct': 0,
                'explanation': '√20 = √(4×5) = √4 × √5 = 2√5'
            },
            {
                'id': 'interval_notation_1',
                'category': 'interval',
                'question': 'Que signifie l\'intervalle [2; 5] ?',
                'options': [
                    'Tous les nombres x tels que 2 < x < 5',
                    'Tous les nombres x tels que 2 ≤ x ≤ 5',
                    'Tous les nombres x tels que 2 < x ≤ 5',
                    'Tous les nombres x tels que 2 ≤ x < 5'
                ],
                'correct': 1,
                'explanation': 'Les crochets fermés [ ] incluent les bornes, donc 2 ≤ x ≤ 5'
            },
            {
                'id': 'sqrt_prop_1',
                'category': 'property',
                'question': 'Quelle est la propriété de √a × √b ?',
                'options': [
                    '√a × √b = √(a + b)',
                    '√a × √b = √(a × b)',
                    '√a × √b = √a + √b',
                    '√a × √b = a × b'
                ],
                'correct': 1,
                'explanation': 'La propriété fondamentale est √a × √b = √(a × b)'
            },
            {
                'id': 'abs_calc_1',
                'category': 'calculation',
                'question': 'Calculez |-7|',
                'options': ['7', '-7', '0', '14'],
                'correct': 0,
                'explanation': '|-7| = 7 car la valeur absolue est toujours positive'
            },
            {
                'id': 'interval_union_1',
                'category': 'interval',
                'question': 'Que vaut ]1;4] ∪ [3;6] ?',
                'options': ['[1;6]', ']1;6]', '[3;4]', ']3;6]'],
                'correct': 1,
                'explanation': 'L\'union prend tous les éléments des deux intervalles, soit ]1;6]'
            }
        ];
    }
    
    bindEvents() {
        // Boutons principaux
        document.getElementById('startQuiz').addEventListener('click', () => this.startQuiz());
        document.getElementById('nextButton').addEventListener('click', () => this.nextQuestion());
        document.getElementById('prevButton').addEventListener('click', () => this.prevQuestion());
        document.getElementById('restartButton').addEventListener('click', () => this.restart());
        document.getElementById('reviewButton').addEventListener('click', () => this.showReview());
        document.getElementById('backToResults').addEventListener('click', () => this.showResults());
        
        // Sélection des catégories
        const categoryCheckboxes = document.querySelectorAll('.category-option input[type="checkbox"]');
        categoryCheckboxes.forEach(checkbox => {
            checkbox.addEventListener('change', () => this.updateSelectedCategories());
        });
    }
    
    updateSelectedCategories() {
        const checkboxes = document.querySelectorAll('.category-option input[type="checkbox"]:checked');
        this.selectedCategories = Array.from(checkboxes).map(cb => cb.value);
        this.updateTotalQuestions();
    }
    
    updateTotalQuestions() {
        const filteredQuestions = this.questions.filter(q => 
            this.selectedCategories.includes(q.category)
        );
        document.getElementById('totalQuestions').textContent = `${filteredQuestions.length} questions`;
    }
    
    startQuiz() {
        // Filtrer les questions selon les catégories sélectionnées
        this.questions = this.questions.filter(q => 
            this.selectedCategories.includes(q.category)
        );
        
        if (this.questions.length === 0) {
            this.showToast('Veuillez sélectionner au moins une catégorie');
            return;
        }
        
        // Mélanger les questions
        this.shuffleArray(this.questions);
        
        // Initialiser les réponses utilisateur
        this.userAnswers = new Array(this.questions.length).fill(null);
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
        
        this.showScreen('quizScreen');
        this.startTimer();
        this.displayQuestion();
        this.updateProgress();
    }
    
    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        document.getElementById('questionNumber').textContent = 
            `Question ${this.currentQuestionIndex + 1}`;
        document.getElementById('questionText').textContent = question.question;
        
        const optionsContainer = document.getElementById('optionsContainer');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option, index) => {
            const optionElement = document.createElement('div');
            optionElement.className = 'option';
            if (this.userAnswers[this.currentQuestionIndex] === index) {
                optionElement.classList.add('selected');
            }
            
            optionElement.innerHTML = `
                <div class="option-letter">${String.fromCharCode(65 + index)}</div>
                <div class="option-text">${option}</div>
            `;
            
            optionElement.addEventListener('click', () => this.selectOption(index));
            optionsContainer.appendChild(optionElement);
        });
        
        this.updateNavigationButtons();
    }
    
    selectOption(optionIndex) {
        this.userAnswers[this.currentQuestionIndex] = optionIndex;
        
        // Mettre à jour l'affichage
        const options = document.querySelectorAll('.option');
        options.forEach((option, index) => {
            option.classList.toggle('selected', index === optionIndex);
        });
        
        // Activer le bouton suivant
        document.getElementById('nextButton').disabled = false;
    }
    
    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
            this.updateProgress();
        } else {
            this.finishQuiz();
        }
    }
    
    prevQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
            this.updateProgress();
        }
    }
    
    updateNavigationButtons() {
        const prevButton = document.getElementById('prevButton');
        const nextButton = document.getElementById('nextButton');
        
        prevButton.disabled = this.currentQuestionIndex === 0;
        nextButton.disabled = this.userAnswers[this.currentQuestionIndex] === null;
        
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextButton.textContent = '🏁 Terminer';
        } else {
            nextButton.textContent = 'Suivant →';
        }
    }
    
    updateProgress() {
        const progress = ((this.currentQuestionIndex + 1) / this.questions.length) * 100;
        document.getElementById('progressBar').style.setProperty('--progress', `${progress}%`);
        document.getElementById('progressText').textContent = 
            `Question ${this.currentQuestionIndex + 1}/${this.questions.length}`;
    }
    
    startTimer() {
        const duration = 20 * 60; // 20 minutes en secondes
        let timeLeft = duration;
        
        this.timerInterval = setInterval(() => {
            const minutes = Math.floor(timeLeft / 60);
            const seconds = timeLeft % 60;
            
            document.getElementById('timer').textContent = 
                `⏰ ${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            if (timeLeft <= 0) {
                this.finishQuiz();
            }
            
            timeLeft--;
        }, 1000);
    }
    
    stopTimer() {
        if (this.timerInterval) {
            clearInterval(this.timerInterval);
            this.timerInterval = null;
        }
    }
    
    finishQuiz() {
        this.stopTimer();
        this.calculateResults();
        this.showResults();
    }
    
    calculateResults() {
        let correctAnswers = 0;
        const categoryStats = {};
        
        this.questions.forEach((question, index) => {
            const isCorrect = this.userAnswers[index] === question.correct;
            if (isCorrect) correctAnswers++;
            
            const category = question.category;
            if (!categoryStats[category]) {
                categoryStats[category] = { correct: 0, total: 0 };
            }
            categoryStats[category].total++;
            if (isCorrect) categoryStats[category].correct++;
        });
        
        this.results = {
            score: correctAnswers,
            total: this.questions.length,
            percentage: Math.round((correctAnswers / this.questions.length) * 100),
            categoryStats: categoryStats,
            duration: Date.now() - this.startTime
        };
    }
    
    showResults() {
        this.showScreen('resultsScreen');
        
        const { score, total, percentage, categoryStats } = this.results;
        
        // Afficher le score principal
        document.getElementById('scorePercentage').textContent = `${percentage}%`;
        document.getElementById('scoreDetails').textContent = 
            `Vous avez obtenu ${score}/${total} bonnes réponses`;
        
        // Animation du cercle de score
        const scoreCircle = document.getElementById('scoreCircle');
        const angle = (percentage / 100) * 360;
        scoreCircle.style.setProperty('--score-angle', `${angle}deg`);
        
        // Message selon le score
        const scoreMessage = document.getElementById('scoreMessage');
        if (percentage >= 90) {
            scoreMessage.textContent = '🏆 Excellent travail !';
        } else if (percentage >= 75) {
            scoreMessage.textContent = '👏 Très bien !';
        } else if (percentage >= 60) {
            scoreMessage.textContent = '👍 Bien joué !';
        } else {
            scoreMessage.textContent = '📚 Il faut réviser !';
        }
        
        // Résultats par catégorie
        const categoryResults = document.getElementById('categoryResults');
        categoryResults.innerHTML = '';
        
        Object.entries(categoryStats).forEach(([category, stats]) => {
            const categoryPercent = Math.round((stats.correct / stats.total) * 100);
            const categoryName = this.getCategoryName(category);
            
            const resultElement = document.createElement('div');
            resultElement.className = 'category-result';
            resultElement.innerHTML = `
                <span>${categoryName}</span>
                <span>${stats.correct}/${stats.total} (${categoryPercent}%)</span>
            `;
            categoryResults.appendChild(resultElement);
        });
    }
    
    showReview() {
        this.showScreen('reviewScreen');
        
        const reviewContent = document.getElementById('reviewContent');
        reviewContent.innerHTML = '';
        
        this.questions.forEach((question, index) => {
            const userAnswer = this.userAnswers[index];
            const isCorrect = userAnswer === question.correct;
            
            const reviewElement = document.createElement('div');
            reviewElement.className = `review-item ${isCorrect ? 'correct' : 'incorrect'}`;
            
            const statusIcon = isCorrect ? '✅' : '❌';
            const userAnswerText = userAnswer !== null ? question.options[userAnswer] : 'Pas de réponse';
            const correctAnswerText = question.options[question.correct];
            
            reviewElement.innerHTML = `
                <div class="review-question">
                    ${statusIcon} Question ${index + 1}: ${question.question}
                </div>
                <div class="review-answer">
                    <strong>Votre réponse:</strong> ${userAnswerText}
                </div>
                <div class="review-answer">
                    <strong>Bonne réponse:</strong> ${correctAnswerText}
                </div>
                <div class="review-explanation">
                    💡 ${question.explanation}
                </div>
            `;
            
            reviewContent.appendChild(reviewElement);
        });
    }
    
    restart() {
        this.currentQuestionIndex = 0;
        this.userAnswers = [];
        this.startTime = null;
        this.stopTimer();
        this.showScreen('startScreen');
    }
    
    showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }
    
    showLoading() {
        document.getElementById('loadingSpinner').classList.add('active');
    }
    
    hideLoading() {
        document.getElementById('loadingSpinner').classList.remove('active');
    }
    
    showToast(message) {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
    
    getCategoryName(category) {
        const categoryNames = {
            'definition': '📚 Définitions',
            'calculation': '🧮 Calculs',
            'property': '⚡ Propriétés',
            'interval': '📏 Intervalles'
        };
        return categoryNames[category] || category;
    }
    
    shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
}

// Initialiser l'application
document.addEventListener('DOMContentLoaded', () => {
    new QCMApp();
});