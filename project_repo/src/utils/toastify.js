// src/utils/toastify.js
import { toast } from 'react-toastify';

export const notify = {
  loading: (msg = 'Working…') => toast.loading(msg),
  success: (msg = 'Done!') => toast.success(msg),
  error: (msg = 'Something went wrong') => toast.error(msg),
  updateOk: (id, msg = 'Success!') =>
    toast.update(id, { render: msg, type: 'success', isLoading: false, autoClose: 1800 }),
  updateErr: (id, msg = 'Failed') =>
    toast.update(id, { render: msg, type: 'error', isLoading: false, autoClose: 3000 }),
};
