import axios from 'axios';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api',
  headers: { Accept: 'application/json' },
  timeout: 8000,
});

async function tryGet(paths) {
  let lastErr;
  for (const p of paths) {
    try {
      const res = await api.get(p);
      return res.data;
    } catch (e) {
      lastErr = e;
      // continue to next path
    }
  }
  throw lastErr;
}

async function tryCall(method, paths, payload) {
  let lastErr;
  for (const p of paths) {
    try {
      const res = await api.request({ url: p, method, data: payload });
      return res.data;
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export function fetchSalaries() {
  // intenta la ruta más probable y una alternativa
  return tryGet(['/addsalary', '/addsalary']);
}

export function fetchUsers() {
  return tryGet(['/addstaff', '/addstaffs', '/staffs']);
}

export function addSalary(payload) {
  return tryCall('post', ['/addsalary', '/addsalary'], payload);
}

export function updateSalary(id, payload) {
  // intenta rutas alternativas incluyendo la forma "actualizar" del backend
  return tryCall('put', [
    `/addsalary/actualizar/${id}`,
    `/addsalary/${id}`,
    `/addsalary/${id}`
  ], payload);
}

export function deleteSalary(id) {
  return tryCall('delete', [`/addsalary/${id}`, `/addsalary/${id}`]);
}
