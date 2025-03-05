const RedirectMap = {
  // 'ADMIN' : '/ucol/titulaciones/admin/panel',
  'ADMIN' : '/ucol/titulaciones/admin/panel',
  'STUDENT' : '/ucol/titulaciones/student/home',
  'TEACHER' : '/ucol/titulaciones/teacher/dashboard',
}

interface RedirectByRoleProps {
  role: keyof typeof RedirectMap;
  navigate: (path: string) => void;
}

const RedirectByRole = ({ role, navigate }: RedirectByRoleProps) => {
  const path = RedirectMap[role];
  navigate(path);
}
export default RedirectByRole;