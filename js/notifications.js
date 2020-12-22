const elements = {
    success: document.getElementById('successBox'),
    loading: document.getElementById('loadingBox'),
    error: document.getElementById('errorBox')
};

elements.success.addEventListener('click', hideSuccess());
elements.error.addEventListener('click', hideError());

let requests = 0;

export function showSuccess(message) {
    elements.success.textContent = message;
    elements.success.style.display = "block";

    setTimeout(hideSuccess, 2000);
}

export function showLoading() {
    requests++;
    elements.loading.style.display = "block";
}

export function hideLoadig() {
    requests--;
    if (requests <= 0) {
        elements.loading.style.display = "none";
    }
}

export function showError(message) {
    elements.error.textContent = message;
    elements.error.style.display = "block";

    setTimeout(hideError, 3000);
}

export function hideError() {
    elements.error.style.display = "none";
}

export function hideSuccess() {
    elements.success.style.display = "none";
}