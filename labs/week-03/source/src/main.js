import './style.css';

const form = document.querySelector('#request-form');
const requesterName = document.querySelector('#requester-name');
const requestType = document.querySelector('#request-type');
const requestDetails = document.querySelector('#request-details');
const previewName = document.querySelector('#preview-name');
const previewType = document.querySelector('#preview-type');
const previewDetails = document.querySelector('#preview-details');
const requestList = document.querySelector('#request-list');
const statusEl = document.querySelector('#form-status');

const errorMap = {
    requesterName: document.querySelector('#requester-name-error'),
    requestType: document.querySelector('#request-type-error'),
    details: document.querySelector('#request-details-error'),
};

function readForm() {
    return {
        requesterName: requesterName.value.trim(),
        requestType: requestType.value,
        details: requestDetails.value.trim(),
    };
}

function renderPreview(data) {
    if (previewName) previewName.textContent = data.requesterName || 'ยังไม่ระบุชื่อ';
    if (previewType) previewType.textContent = data.requestType || 'ยังไม่เลือกประเภท';
    if (previewDetails) previewDetails.textContent = data.details || 'ยังไม่มีรายละเอียด';
}

function validate(data) {
    const errors = {};

    if (!data.requesterName) {
        errors.requesterName = 'กรุณาใส่ชื่อผู้ร้องขอ';
    }

    if (!data.requestType) {
        errors.requestType = 'กรุณาเลือกประเภทคำร้อง';
    }

    if (!data.details) {
        errors.details = 'กรุณาใส่รายละเอียดคำร้อง';
    }

    return errors;
}

function renderErrors(errors) {
    Object.entries(errorMap).forEach(([field, errorEl]) => {
        const isInvalid = Boolean(errors[field]);
        const inputEl = form.querySelector(`[name="${field}"]`);

        if (inputEl) {
            inputEl.setAttribute('aria-invalid', isInvalid ? 'true' : 'false');
        }

        if (errorEl) {
            errorEl.textContent = errors[field] || '';
        }
    });

    if (!statusEl) return;

    if (Object.keys(errors).length > 0) {
        statusEl.textContent = 'พบข้อผิดพลาด กรุณาแก้ไขก่อนส่ง';
        statusEl.classList.add('status-error');
        statusEl.classList.remove('status-success');
    } else {
        statusEl.textContent = 'ข้อมูลพร้อมส่ง';
        statusEl.classList.add('status-success');
        statusEl.classList.remove('status-error');
    }
}

function createRequestItem(data) {
    const item = document.createElement('li');
    item.className = 'request-item';
    item.innerHTML = `
        <strong>${data.requesterName}</strong>
        <span class="request-type">${data.requestType}</span>
        <p>${data.details}</p>
    `;
    return item;
}

function resetFormState() {
    form.reset();
    Object.keys(errorMap).forEach((field) => {
        const inputEl = form.querySelector(`[name="${field}"]`);
        if (inputEl) inputEl.setAttribute('aria-invalid', 'false');
        const errorEl = errorMap[field];
        if (errorEl) errorEl.textContent = '';
    });
}

function handleInput() {
    const data = readForm();
    renderPreview(data);
    renderErrors(validate(data));
}

if (form) {
    form.addEventListener('input', handleInput);

    form.addEventListener('submit', (ev) => {
        ev.preventDefault();

        const data = readForm();
        const errors = validate(data);

        renderErrors(errors);

        if (Object.keys(errors).length > 0) {
            return;
        }

        if (requestList) {
            requestList.appendChild(createRequestItem(data));
        }

        if (statusEl) {
            statusEl.textContent = 'ส่งคำร้องเรียบร้อยแล้ว';
            statusEl.classList.add('status-success');
            statusEl.classList.remove('status-error');
        }

        resetFormState();
        renderPreview({ requesterName: '', requestType: '', details: '' });
    });
}

console.log('LAB 3 app ready', form);
