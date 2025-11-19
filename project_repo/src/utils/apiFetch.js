// src/utils/apiFetch.js
import { notify } from './Toastify';

export async function apiFetch(url, opts = {}, { showLoader = true, loadingMsg = 'Loading…', successMsg } = {}) {
    const id = showLoader ? notify.loading(loadingMsg) : null;
    try {
        const res = await fetch(url, opts);
        if (!res.ok) {
            const text = await res.text().catch(() => '');
            const msg = text || `Request failed (${res.status})`;
            throw new Error(msg);
        }
        if (id && successMsg) notify.updateOk(id, successMsg);
        else if (id) notify.updateOk(id, 'Success');
        return res;
    } catch (e) {
        if (id) notify.updateErr(id, e.message);
        else notify.error(e.message);
        throw e;
    }
}
