export function updateCircularProgress(elementId, percent) {
    const element = document.getElementById(elementId);
    if (!element) return;
    
    const circle = element.querySelector('.progress-fill');
    if (circle) {
        const circumference = 2 * Math.PI * 45;
        const offset = circumference - (percent / 100) * circumference;
        circle.style.strokeDasharray = `${circumference}`;
        circle.style.strokeDashoffset = offset;
    }
}
