document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.faq-question').forEach((question) => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            if (answer.style.display === 'block') {
                answer.style.display = 'none';
            } else {
                answer.style.display = 'block';
            }
        });
    });

    setInterval(createFallingBall, 300);
});

const MAX_BALLS = 35;
let currentBalls = 0;

function createFallingBall() {
    if (currentBalls >= MAX_BALLS) {
        return;
    }

    const ball = document.createElement('div');
    ball.classList.add('ball');

    const startX = Math.random() * window.innerWidth;
    ball.style.left = `${startX}px`;

    const fallDuration = Math.random() * 3 + 2;
    ball.style.animation = `fall ${fallDuration}s linear infinite`;

    document.body.appendChild(ball);

    currentBalls++;

    ball.addEventListener('animationend', () => {
        ball.remove();
        currentBalls--;
    });
}