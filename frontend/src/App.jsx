import React, { useEffect, useId, useState } from 'react';
import {
  BookOpen, Check, Download, Eye, EyeOff, FileText, GraduationCap, LogIn,
  LogOut, Menu, Pencil, Search, ShieldCheck, Trash2, Upload, UserPlus, UserRound, X,
} from 'lucide-react';
import { api, fileUrl } from './services/api';

const emptyReg = {
  name: '', email: '', userCode: '', password: '', phone: '', role: 'STUDENT',
  branch: 'AI & ML', yearOfStudy: 2, semester: 4, section: 'A',
  department: '', designation: '',
};
const branches = ['AI & ML', 'CSE', 'CSM', 'CAD', 'ECE', 'EEE', 'Civil', 'Mechanical'];
const departments = ['Allied Branches', 'CSE', 'ECE', 'EEE', 'Civil', 'Mechanical'];
const designations = ['Assistant Professor', 'Associate Professor', 'Professor', 'Lecturer'];

function App() {
  const [hash, setHash] = useState(location.hash || '#dashboard');
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('user')); } catch { return null; }
  });
  const [menu, setMenu] = useState(false);

  useEffect(() => {
    const onHashChange = () => setHash(location.hash || '#dashboard');
    addEventListener('hashchange', onHashChange);
    return () => removeEventListener('hashchange', onHashChange);
  }, []);

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    location.hash = 'dashboard';
  };

  if (!user) return <Auth onLogged={setUser} />;

  return (
    <div className="app">
      <header>
        <div className="brand">
          <div className="logo"><BookOpen size={23} /></div>
          <div><b>College Notes Hub</b><span>Learn. Share. Access.</span></div>
        </div>
        <button className="mobile" onClick={() => setMenu(!menu)} aria-label="Toggle navigation"><Menu /></button>
        <nav className={menu ? 'open' : ''}>
          <a onClick={() => { location.hash = 'dashboard'; setMenu(false); }}>Dashboard</a>
          <a onClick={() => { location.hash = 'notes'; setMenu(false); }}>Notes</a>
          {user.role === 'STUDENT' && <a onClick={() => { location.hash = 'faculty'; setMenu(false); }}>Faculty</a>}
          {user.role === 'FACULTY' && <a onClick={() => { location.hash = 'requests'; setMenu(false); }}>Requests</a>}
          <button className="profile" onClick={() => { location.hash = 'profile'; setMenu(false); }}><UserRound size={16} />{user.name}</button>
          <button className="logout" onClick={logout} aria-label="Log out"><LogOut size={16} /></button>
        </nav>
      </header>
      <main>
        {hash === '#profile' ? <Profile user={user} onUpdated={setUser} />
          : hash === '#faculty' && user.role === 'STUDENT' ? <FacultyPage user={user} />
            : hash === '#requests' && user.role === 'FACULTY' ? <RequestsPage />
              : hash === '#notes' ? <NotesPage user={user} />
                : <Dashboard user={user} />}
      </main>
      <footer>College Notes Hub - FSD Mini Project</footer>
    </div>
  );
}

function Auth({ onLogged }) {
  const [auth, setAuth] = useState('login');
  const [role, setRole] = useState('STUDENT');
  const [resetMode, setResetMode] = useState(false);
  const [form, setForm] = useState({ ...emptyReg });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => setForm(current => ({
    ...current,
    role,
    department: role === 'FACULTY' && !current.department ? departments[0] : current.department,
  })), [role]);

  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const submit = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const body = auth === 'login'
        ? { identifier: form.identifier, password: form.password }
        : form;
      const result = await api(auth === 'login' ? '/auth/login' : '/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      onLogged(result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      <section className="auth-art">
        <div className="floating"><BookOpen size={42} /></div>
        <h1>One place for every class note.</h1>
        <p>Faculty upload. Students request access. Approved students learn and download securely.</p>
        <div className="ticks"><span>Role-based access</span><span>PDF and image support</span><span>Search and download</span></div>
      </section>
      <section className="auth-card">
        <div className="brand center">
          <div className="logo"><BookOpen size={23} /></div>
          <div><b>College Notes Hub</b><span>Learning Portal</span></div>
        </div>
        {resetMode ? <PasswordReset onBack={() => setResetMode(false)} /> : <>
        <div className="role-tabs">
          <button className={role === 'STUDENT' ? 'active' : ''} onClick={() => setRole('STUDENT')}><GraduationCap size={17} /> Student</button>
          <button className={role === 'FACULTY' ? 'active' : ''} onClick={() => setRole('FACULTY')}><ShieldCheck size={17} /> Faculty</button>
        </div>
        <div className="switch">
          <button className={auth === 'login' ? 'active' : ''} onClick={() => setAuth('login')}><LogIn size={16} /> Login</button>
          <button className={auth === 'register' ? 'active' : ''} onClick={() => setAuth('register')}><UserPlus size={16} /> Register</button>
        </div>
        <form onSubmit={submit}>
          {auth === 'register' ? <>
            <Field label="Full name" value={form.name} onChange={value => update('name', value)} placeholder="Enter full name" />
            <Field label={role === 'STUDENT' ? 'Student ID' : 'Faculty ID'} value={form.userCode} onChange={value => update('userCode', value)} placeholder={role === 'STUDENT' ? '24A81A1234' : 'FAC102'} />
            <Field label="Email" type="email" value={form.email} onChange={value => update('email', value)} placeholder="college@email.com" />
            <Field
              label="Mobile number (Twilio format)"
              type="tel"
              value={form.phone}
              onChange={value => update('phone', value)}
              placeholder="+919876543210"
              pattern="\\+[1-9][0-9 ()-]{6,20}[0-9]"
              title="Enter an international number, e.g. +919876543210. Spaces, hyphens, and parentheses are okay."
              helpText="Use +, country code, and number (e.g. +919876543210). Spaces, hyphens, and parentheses are okay."
            />
            {role === 'STUDENT' ? <div className="grid2">
              <Select label="Branch" value={form.branch} onChange={value => update('branch', value)} options={branches} />
              <Select label="Year" value={form.yearOfStudy} onChange={value => update('yearOfStudy', Number(value))} options={[1, 2, 3, 4]} />
              <Select label="Semester" value={form.semester} onChange={value => update('semester', Number(value))} options={[1, 2, 3, 4, 5, 6, 7, 8]} />
              <Select label="Section" value={form.section} onChange={value => update('section', value)} options={['A', 'B', 'C', 'D']} />
            </div> : <div className="grid2">
              <Select label="Department" value={form.department} onChange={value => update('department', value)} options={departments} required />
              <Select label="Designation" value={form.designation} onChange={value => update('designation', value)} options={designations} />
            </div>}
          </> : <Field label="Email or ID" value={form.identifier || ''} onChange={value => update('identifier', value)} placeholder="Email / Student ID / Faculty ID" />}
          <Field label="Password" type="password" value={form.password} onChange={value => update('password', value)} placeholder="Minimum 6 characters" showPasswordToggle />
          {error && <div className="error">{error}</div>}
          <button className="primary wide" disabled={loading}>{loading ? 'Please wait...' : auth === 'login' ? 'Login to Portal' : 'Create Account'}</button>
        </form>
        <p className="hint">{auth === 'login' ? 'New here? Switch to Register above.' : 'Already registered? Switch to Login above.'}</p>
        {auth === 'login' && <button className="text-button" type="button" onClick={() => setResetMode(true)}>Forgot password?</button>}
        </>}
      </section>
    </div>
  );
}

function PasswordReset({ onBack }) {
  const [stage, setStage] = useState('request');
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const requestCode = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api('/auth/password-reset/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier }),
      });
      setMessage(result.message);
      setStage('confirm');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    try {
      const result = await api('/auth/password-reset/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code, newPassword }),
      });
      setMessage(result.message);
      setStage('done');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return <div className="password-reset">
    <button className="text-button" type="button" onClick={onBack}>Back to login</button>
    <h2>Reset your password</h2>
    {message && <p className="hint">{message}</p>}
    {stage === 'request' && <form onSubmit={requestCode}>
      <Field label="Email, ID, or mobile number" type="text" value={identifier} onChange={setIdentifier} placeholder="Email / Student ID / +919876543210" />
      <p className="hint">We’ll send a code to the mobile number registered to the account. The number must include its country code, for example +919876543210.</p>
      {error && <div className="error">{error}</div>}
      <button className="primary wide" disabled={loading}>{loading ? 'Please wait...' : 'Send SMS code'}</button>
    </form>}
    {stage === 'confirm' && <form onSubmit={resetPassword}>
      <Field label="SMS verification code" value={code} onChange={setCode} placeholder="Enter the code you received" />
      <Field label="New password" type="password" value={newPassword} onChange={setNewPassword} placeholder="Minimum 6 characters" showPasswordToggle />
      {error && <div className="error">{error}</div>}
      <button className="primary wide" disabled={loading}>{loading ? 'Please wait...' : 'Reset password'}</button>
    </form>}
    {stage === 'done' && <button className="primary wide" type="button" onClick={onBack}>Return to login</button>}
  </div>;
}

function Field({ label, value, onChange, placeholder, type = 'text', required = true, showPasswordToggle = false, pattern, title, helpText }) {
  const inputId = useId();
  const [passwordVisible, setPasswordVisible] = useState(false);
  const inputType = showPasswordToggle && passwordVisible ? 'text' : type;

  if (showPasswordToggle) {
    return <div className="field">
      <label className="field-label" htmlFor={inputId}>{label}</label>
      <div className="password-input">
        <input id={inputId} type={inputType} value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} />
        <button className="password-toggle" type="button" aria-label={passwordVisible ? 'Hide password' : 'Show password'} aria-pressed={passwordVisible} title={passwordVisible ? 'Hide password' : 'Show password'} onClick={() => setPasswordVisible(visible => !visible)}>
          {passwordVisible ? <Eye size={17} /> : <EyeOff size={17} />}
        </button>
      </div>
    </div>;
  }

  return <label className="field"><span>{label}</span><input type={type} value={value ?? ''} onChange={event => onChange(event.target.value)} placeholder={placeholder} required={required} pattern={pattern} title={title} />{helpText && <small className="field-hint">{helpText}</small>}</label>;
}

function Select({ label, value, onChange, options, required = false }) {
  return <label className="field"><span>{label}</span><select value={value} onChange={event => onChange(event.target.value)} required={required}>{options.map(option => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function Dashboard({ user }) {
  const [requests, setRequests] = useState([]);
  const [noteCount, setNoteCount] = useState(0);
  const [subjectCount, setSubjectCount] = useState(0);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [notes, currentRequests] = await Promise.all([api('/notes'), api('/requests')]);
      setNoteCount(notes.length);
      setRequests(currentRequests);
      if (user.role === 'FACULTY') setSubjectCount((await api('/subjects/mine')).length);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => { load(); }, []);

  return <>
    <section className="hero">
      <div><div className="eyebrow">{user.role} WORKSPACE</div>
        <h1>Good to see you, <em>{user.name.split(' ')[0]}</em>.</h1>
        <p>{user.role === 'FACULTY' ? 'Your teaching activity and access requests at a glance.' : 'Your study resources and faculty access at a glance.'}</p>
      </div>
      <div className="hero-icon">{user.role === 'FACULTY' ? <Upload size={38} /> : <GraduationCap size={38} />}</div>
    </section>
    {message && <div className="error">{message}</div>}
    <div className="section-title"><div><h2>Overview</h2><span>Current account activity</span></div></div>
    <div className="detail-chips">
      <span>{noteCount} {user.role === 'FACULTY' ? 'uploaded' : 'available'} notes</span>
      {user.role === 'FACULTY' && <span>{subjectCount} subjects</span>}
      <span>{requests.filter(request => request.status === 'PENDING').length} pending requests</span>
    </div>
    {user.role === 'STUDENT' && requests.length > 0 && <div className="mini-panel"><div className="section-title"><div><h2>Recent access requests</h2><span>Track faculty approvals</span></div></div>{requests.slice(0, 4).map(request => <RequestRow key={request.id} request={request} />)}</div>}
  </>;
}

function NotesPage({ user }) {
  const [notes, setNotes] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [query, setQuery] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [message, setMessage] = useState('');

  const load = async () => {
    try {
      const [availableNotes, facultySubjects] = await Promise.all([
        api(`/notes?q=${encodeURIComponent(query)}`),
        user.role === 'FACULTY' ? api('/subjects/mine') : Promise.resolve([]),
      ]);
      setNotes(availableNotes);
      setSubjects(facultySubjects);
      setMessage('');
    } catch (error) {
      setMessage(error.message);
    }
  };
  useEffect(() => { load(); }, [query]);

  return <>
    <section className="page-head"><div><div className="eyebrow">{user.role === 'FACULTY' ? 'FACULTY LIBRARY' : 'STUDY LIBRARY'}</div><h1>{user.role === 'FACULTY' ? 'Manage notes' : 'Your notes'}</h1><p>{user.role === 'FACULTY' ? 'Search, organize, and upload subject materials.' : 'Browse materials for subjects with approved access.'}</p></div></section>
    <div className="toolbar">
      <div className="search"><Search size={18} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Search notes, subjects..." /></div>
      {user.role === 'FACULTY' && <button className="primary" onClick={() => setShowUpload(!showUpload)}><Upload size={17} /> Upload notes</button>}
    </div>
    {user.role === 'FACULTY' && <SubjectManager subjects={subjects} onChanged={load} />}
    {showUpload && <UploadPanel subjects={subjects} onDone={() => { setShowUpload(false); load(); }} />}
    <div className="section-title"><div><h2>{user.role === 'FACULTY' ? 'Your notes' : 'Available notes'}</h2><span>{notes.length} resources</span></div></div>
    {message && <div className="error">{message}</div>}
    <div className="note-grid">
      {notes.map(note => <NoteCard key={note.id} note={note} canDelete={user.role === 'FACULTY'} onDelete={async () => { await api(`/notes/${note.id}`, { method: 'DELETE' }); load(); }} />)}
      {notes.length === 0 && !message && <Empty title={user.role === 'STUDENT' ? 'No approved notes yet' : 'No notes uploaded yet'} text={user.role === 'STUDENT' ? 'Request access from a faculty member to view subject notes.' : 'Upload your first PDF or image to start building your library.'} />}
    </div>
  </>;
}

function NoteCard({ note, canDelete, onDelete }) {
  const [previewUrl, setPreviewUrl] = useState('');
  const getFile = async () => {
    const response = await fetch(fileUrl(note.id), { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
    if (!response.ok) throw new Error('Unable to open this file.');
    return URL.createObjectURL(await response.blob());
  };
  const view = async () => {
    try { setPreviewUrl(await getFile()); } catch (error) { alert(error.message); }
  };
  const download = async () => {
    try {
      const url = await getFile();
      const anchor = document.createElement('a');
      anchor.href = url;
      anchor.download = note.fileName;
      anchor.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) { alert(error.message); }
  };

  return <article className="note-card">
    <div className="file-icon">{note.fileType === 'application/pdf' ? <FileText /> : <span>IMG</span>}</div>
    <div className="note-main"><div className="tag">{note.subjectName} - Unit {note.unit || '-'}</div>
      <h3>{note.title}</h3><p>{note.description || 'Learning material uploaded by faculty.'}</p>
      <small>By {note.facultyName} - {note.uploadedAt ? new Date(note.uploadedAt).toLocaleDateString() : ''}</small>
      <div className="actions"><button className="ghost" onClick={view}>View</button><button className="ghost" onClick={download}><Download size={15} /> Download</button>{canDelete && <button className="danger" onClick={onDelete} aria-label="Delete note"><Trash2 size={15} /></button>}</div>
    </div>
    {previewUrl && <div className="preview"><button className="danger" onClick={() => { URL.revokeObjectURL(previewUrl); setPreviewUrl(''); }}>Close</button><iframe title={note.title} src={previewUrl} /></div>}
  </article>;
}

function UploadPanel({ subjects, onDone }) {
  const [form, setForm] = useState({ title: '', description: '', unit: 1, subjectId: subjects[0]?.id || '' });
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  useEffect(() => { if (!form.subjectId && subjects[0]) setForm(current => ({ ...current, subjectId: subjects[0].id })); }, [subjects]);

  const submit = async event => {
    event.preventDefault();
    setError('');
    if (!file) { setError('Choose a PDF or image file.'); return; }
    const data = new FormData();
    Object.entries(form).forEach(([key, value]) => data.append(key, value));
    data.append('file', file);
    try { await api('/notes/upload', { method: 'POST', body: data }); onDone(); }
    catch (err) { setError(err.message); }
  };

  return <form className="upload-panel" onSubmit={submit}>
    <div><h3>Upload learning material</h3><p>PDF, JPG, JPEG, PNG - Maximum 25 MB</p></div>
    {subjects.length === 0 ? <div className="error">Create a subject before uploading notes.</div> : <>
      <div className="grid2">
        <Field label="Title" value={form.title} onChange={value => setForm({ ...form, title: value })} placeholder="e.g. Routing Algorithms" />
        <label className="field"><span>Subject</span><select value={form.subjectId} onChange={event => setForm({ ...form, subjectId: Number(event.target.value) })}>{subjects.map(subject => <option key={subject.id} value={subject.id}>{subject.name} - Sem {subject.semester}</option>)}</select></label>
        <Field label="Unit" value={form.unit} onChange={value => setForm({ ...form, unit: value })} placeholder="3" />
        <label className="field"><span>File</span><input type="file" accept="application/pdf,image/jpeg,image/png" onChange={event => setFile(event.target.files?.[0] || null)} required /></label>
      </div>
      <Field label="Description" value={form.description} onChange={value => setForm({ ...form, description: value })} placeholder="Short description" required={false} />
      {error && <div className="error">{error}</div>}
      <button className="primary"><Upload size={16} /> Save note</button>
    </>}
  </form>;
}

function SubjectManager({ subjects, onChanged }) {
  const [name, setName] = useState('');
  const [branch, setBranch] = useState('AI & ML');
  const [semester, setSemester] = useState(4);
  const [busy, setBusy] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(null);
  const [editError, setEditError] = useState('');
  const add = async () => {
    if (!name.trim()) return;
    setBusy(true);
    try {
      await api('/subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, branch, semester }) });
      setName('');
      onChanged();
    } catch (error) { alert(error.message); }
    finally { setBusy(false); }
  };
  const startEditing = subject => {
    setEditingId(subject.id);
    setEditForm({ name: subject.name, branch: subject.branch || branches[0], semester: subject.semester || 1 });
    setEditError('');
  };
  const cancelEditing = () => {
    setEditingId(null);
    setEditForm(null);
    setEditError('');
  };
  const saveEdit = async subjectId => {
    if (!editForm?.name.trim()) {
      setEditError('Subject name is required.');
      return;
    }
    setBusy(true);
    setEditError('');
    try {
      await api(`/subjects/${subjectId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editForm) });
      cancelEditing();
      onChanged();
    } catch (error) {
      setEditError(error.message);
    } finally {
      setBusy(false);
    }
  };
  return <div className="upload-panel subject-manager">
    <div><h3>Manage your subjects</h3><p>Add the subjects you teach. Students can request access to these subjects.</p></div>
    <div className="grid2"><Field label="Subject name" value={name} onChange={setName} placeholder="Computer Networks" /><Select label="Branch" value={branch} onChange={setBranch} options={branches} /><Select label="Semester" value={semester} onChange={value => setSemester(Number(value))} options={[1, 2, 3, 4, 5, 6, 7, 8]} /></div>
    <button type="button" className="primary" onClick={add} disabled={busy}>+ {busy ? 'Adding...' : 'Add subject'}</button>
    <div className="subject-list">{subjects.map(subject => editingId === subject.id ? <div className="subject-edit-item" key={subject.id}>
      <div className="grid2">
        <Field label="Subject name" value={editForm.name} onChange={value => setEditForm({ ...editForm, name: value })} />
        <Select label="Branch" value={editForm.branch} onChange={value => setEditForm({ ...editForm, branch: value })} options={branches} />
        <Select label="Semester" value={editForm.semester} onChange={value => setEditForm({ ...editForm, semester: Number(value) })} options={[1, 2, 3, 4, 5, 6, 7, 8]} />
      </div>
      {editError && <div className="error">{editError}</div>}
      <div className="actions">
        <button type="button" className="primary" onClick={() => saveEdit(subject.id)} disabled={busy}><Check size={15} /> Save</button>
        <button type="button" className="ghost" onClick={cancelEditing} disabled={busy}><X size={15} /> Cancel</button>
      </div>
    </div> : <div className="subject-row" key={subject.id}>
      <div><b>{subject.name}</b><span>{subject.branch} - Sem {subject.semester}</span></div>
      <button type="button" className="ghost" onClick={() => startEditing(subject)} title={`Edit ${subject.name}`} aria-label={`Edit ${subject.name}`}><Pencil size={15} /> Edit</button>
    </div>)}</div>
  </div>;
}

function FacultyPage({ user }) {
  const [faculty, setFaculty] = useState([]);
  const [selected, setSelected] = useState(null);
  const [subjects, setSubjects] = useState([]);
  const [requests, setRequests] = useState([]);
  useEffect(() => { Promise.all([api('/users/faculty'), api('/requests')]).then(([people, rows]) => { setFaculty(people); setRequests(rows); }).catch(error => alert(error.message)); }, []);
  const choose = async person => {
    setSelected(person);
    try { setSubjects(await api(`/subjects?facultyId=${person.id}`)); }
    catch (error) { alert(error.message); }
  };
  const send = async subject => {
    try {
      await api('/requests', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ facultyId: selected.id, subjectId: subject.id }) });
      setRequests(await api('/requests'));
    } catch (error) { alert(error.message); }
  };
  const facultyByDepartment = faculty.reduce((groups, person) => {
    const department = person.department?.trim() || 'Department not specified';
    (groups[department] ||= []).push(person);
    return groups;
  }, {});
  const departments = Object.keys(facultyByDepartment).sort((a, b) => a.localeCompare(b));
  return <>
    <section className="page-head"><div><div className="eyebrow">FACULTY DIRECTORY</div><h1>Request access from faculty</h1><p>Your registered academic details are attached to each request.</p></div></section>
    <div className="faculty-layout"><div className="faculty-list">{departments.map(department => <section className="faculty-group" key={department}><h2>{department}</h2>{facultyByDepartment[department].map(person => <button key={person.id} className={`faculty-item ${selected?.id === person.id ? 'selected' : ''}`} onClick={() => choose(person)}><div className="avatar">{person.name?.[0]}</div><div><b>{person.name}</b><span>{person.designation || 'Faculty'}</span></div></button>)}</section>)}{faculty.length === 0 && <Empty title="No faculty yet" text="Faculty members will appear here after they register." />}</div>
      <div className="access-card">{selected ? <>
        <div className="selected-faculty"><div className="avatar big">{selected.name?.[0]}</div><div><h2>{selected.name}</h2><p>{selected.department} - {selected.designation}</p></div></div>
        <div className="student-snapshot"><b>Your request details</b><span>{user.name} - {user.userCode}</span><span>{user.branch} - Year {user.yearOfStudy} - Sem {user.semester} - Sec {user.section}</span></div>
        <h3>Choose subject</h3>
        {subjects.map(subject => {
          const request = requests.find(row => row.subject?.id === subject.id && row.faculty?.id === selected.id);
          return <div className="subject-row" key={subject.id}><div><b>{subject.name}</b><span>{subject.branch} - Sem {subject.semester}</span></div>{request ? <span className={`status ${request.status.toLowerCase()}`}>{request.status}</span> : <button className="primary" onClick={() => send(subject)}>Request access</button>}</div>;
        })}
        {subjects.length === 0 && <Empty title="No subjects listed" text="This faculty has not added a subject yet." />}
      </> : <Empty title="Select a faculty" text="Choose a faculty member to view subjects and request access." />}</div>
    </div>
  </>;
}

function RequestsPage() {
  const [rows, setRows] = useState([]);
  const [error, setError] = useState('');
  const load = () => api('/requests').then(setRows).catch(err => setError(err.message));
  useEffect(() => { load(); }, []);
  const decide = async (id, status) => {
    try { await api(`/requests/${id}?status=${status}`, { method: 'PUT' }); load(); }
    catch (err) { setError(err.message); }
  };
  return <>
    <section className="page-head"><div><div className="eyebrow">ACCESS CONTROL</div><h1>Student requests</h1><p>Review academic details before granting subject access.</p></div></section>
    {error && <div className="error">{error}</div>}
    <div className="request-list">{rows.map(request => <div className="request-card" key={request.id}><div className="avatar">{request.student?.name?.[0]}</div><div className="request-info"><div className="request-top"><div><h3>{request.student?.name}</h3><span>{request.student?.userCode} - {request.student?.email}</span></div><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></div><div className="detail-chips"><span>{request.student?.branch || '-'}</span><span>Year {request.student?.yearOfStudy || '-'}</span><span>Sem {request.student?.semester || '-'}</span><span>Section {request.student?.section || '-'}</span><span>{request.subject?.name}</span></div>{request.status === 'PENDING' && <div className="actions"><button className="primary" onClick={() => decide(request.id, 'ACCEPTED')}><Check size={16} /> Accept</button><button className="ghost danger" onClick={() => decide(request.id, 'REJECTED')}><X size={16} /> Reject</button></div>}</div></div>)}{rows.length === 0 && <Empty title="No requests" text="New student requests will appear here." />}</div>
  </>;
}

function RequestRow({ request }) {
  return <div className="request-row"><div><b>{request.faculty?.name}</b><span>{request.subject?.name}</span></div><span className={`status ${request.status.toLowerCase()}`}>{request.status}</span></div>;
}

function Profile({ user, onUpdated }) {
  const [form, setForm] = useState({ ...user });
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const update = (key, value) => setForm(current => ({ ...current, [key]: value }));
  const cancel = () => {
    setForm({ ...user });
    setEditing(false);
    setError('');
    setMessage('');
  };
  const save = async event => {
    event.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const { name, email, userCode, phone, branch, yearOfStudy, semester, section, department, designation } = form;
      const result = await api('/users/me', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, userCode, phone, branch, yearOfStudy, semester, section, department, designation }),
      });
      localStorage.setItem('token', result.token);
      localStorage.setItem('user', JSON.stringify(result.user));
      onUpdated(result.user);
      setForm({ ...result.user });
      setEditing(false);
      setMessage('Your profile has been updated.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const details = [['Email', user.email], ['Phone', user.phone], ['Role', user.role], ['Branch', user.branch], ['Year', user.yearOfStudy], ['Semester', user.semester], ['Section', user.section], ['Department', user.department], ['Designation', user.designation]];
  return <><section className="page-head"><div><div className="eyebrow">MY PROFILE</div><h1>Account information</h1><p>Your identity and academic details used in access requests.</p></div></section><div className="profile-card"><div className="profile-banner"><div className="avatar huge">{user.name?.[0]}</div><div><h2>{user.name}</h2><p>{user.role} - {user.userCode}</p></div>{!editing && <button className="primary small profile-edit" onClick={() => { setForm({ ...user }); setEditing(true); setMessage(''); }}><Pencil size={15} /> Edit profile</button>}</div>
    {error && <div className="error" role="alert">{error}</div>}
    {message && <div className="success" role="status">{message}</div>}
    {editing ? <form onSubmit={save} className="profile-form">
      <div className="grid2">
        <Field label="Full name" value={form.name} onChange={value => update('name', value)} />
        <Field label={user.role === 'STUDENT' ? 'Student ID' : 'Faculty ID'} value={form.userCode} onChange={value => update('userCode', value)} />
        <Field label="Email" type="email" value={form.email} onChange={value => update('email', value)} />
        <Field label="Mobile number" type="tel" value={form.phone || ''} onChange={value => update('phone', value)} required={false} pattern="\\+[1-9][0-9 ()-]{6,20}[0-9]" title="Enter an international number, e.g. +919876543210." helpText="Use +, country code, and number. Leave blank to remove your phone number." />
      </div>
      {user.role === 'STUDENT' ? <div className="grid2">
        <Select label="Branch" value={form.branch || branches[0]} onChange={value => update('branch', value)} options={branches} />
        <Select label="Year" value={form.yearOfStudy || 1} onChange={value => update('yearOfStudy', Number(value))} options={[1, 2, 3, 4]} />
        <Select label="Semester" value={form.semester || 1} onChange={value => update('semester', Number(value))} options={[1, 2, 3, 4, 5, 6, 7, 8]} />
        <Select label="Section" value={form.section || 'A'} onChange={value => update('section', value)} options={['A', 'B', 'C', 'D']} />
      </div> : <div className="grid2">
        <Select label="Department" value={form.department || departments[0]} onChange={value => update('department', value)} options={departments} required />
        <Select label="Designation" value={form.designation || 'Assistant Professor'} onChange={value => update('designation', value)} options={designations} />
      </div>}
      <div className="actions"><button className="primary" disabled={loading}>{loading ? 'Saving...' : 'Save changes'}</button><button className="ghost" type="button" onClick={cancel} disabled={loading}>Cancel</button></div>
    </form> : <div className="profile-grid">{details.filter(([, value]) => value != null && value !== '').map(([label, value]) => <div key={label}><span>{label}</span><b>{value}</b></div>)}</div>}
  </div></>;
}

function Empty({ title, text }) {
  return <div className="empty"><div className="empty-icon"><BookOpen /></div><h3>{title}</h3><p>{text}</p></div>;
}

export default App;
