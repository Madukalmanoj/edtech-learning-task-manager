import { useEffect, useState } from 'react';
import type { FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import api from '@/api/client';

interface Teacher {
  id: string;
  email: string;
}

const SignupPage = () => {
  const { signup } = useAuth();
  const navigate = useNavigate();
  type RoleOption = 'student' | 'teacher';
  const [form, setForm] = useState<{
    email: string;
    password: string;
    role: RoleOption;
    teacherId: string;
  }>({
    email: '',
    password: '',
    role: 'student',
    teacherId: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [teachersLoading, setTeachersLoading] = useState(true);
  const [teachersError, setTeachersError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    const loadTeachers = async () => {
      try {
        setTeachersLoading(true);
        setTeachersError(null);
        const { data } = await api.get('/auth/teachers');
        if (isMounted) {
          setTeachers(data.teachers ?? []);
        }
      } catch (error: any) {
        console.error('Failed to load teachers', error);
        if (isMounted) {
          setTeachersError(error.response?.data?.message || 'Could not load teachers');
          toast.error('Unable to load teachers. Try refreshing.');
        }
      } finally {
        if (isMounted) {
          setTeachersLoading(false);
        }
      }
    };

    loadTeachers();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (form.role === 'teacher') {
      setForm((prev) => ({ ...prev, teacherId: '' }));
    }
  }, [form.role]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (form.role === 'student' && !form.teacherId) {
      toast.error('Students must select their teacher.');
      return;
    }
    setIsSubmitting(true);
    try {
      const { email, password, role, teacherId } = form;
      const payload =
        role === 'student'
          ? { email, password, role, teacherId }
          : { email, password, role };
      await signup(payload);
      toast.success('Account created. Please log in.');
      navigate('/login');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Signup failed');
    } finally {
      setIsSubmitting(false);
    }
  };

  const teacherSelectDisabled = teachersLoading || !!teachersError || !teachers.length;

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-indigo-500 via-purple-500 to-slate-900 px-4">
      <Card className="w-full max-w-xl border-slate-700/40 bg-white/95 shadow-2xl dark:bg-slate-900/85">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">Create an account</CardTitle>
          <CardDescription>Invite students or get guided by your teacher.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="grid gap-4 md:grid-cols-2" onSubmit={handleSubmit}>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))}
              />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={form.password}
                onChange={(e) => setForm((prev) => ({ ...prev, password: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Select
                value={form.role}
                onValueChange={(value) => setForm((prev) => ({ ...prev, role: value as RoleOption }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="teacher">Teacher</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {form.role === 'student' && (
              <div className="space-y-2">
                <Label htmlFor="teacherId">Teacher</Label>
                <Select
                  disabled={teacherSelectDisabled}
                  value={form.teacherId}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, teacherId: value }))}
                >
                  <SelectTrigger id="teacherId">
                    <SelectValue
                      placeholder={
                        teachersLoading
                          ? 'Loading teachers...'
                          : teachersError
                          ? 'Unable to load teachers'
                          : 'Select your teacher'
                      }
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {teachers.map((teacher) => (
                      <SelectItem key={teacher.id} value={teacher.id}>
                        {teacher.email}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {teachersError && (
                  <p className="text-sm text-destructive">
                    Unable to load teachers. Refresh or try again later.
                  </p>
                )}
              </div>
            )}
            <div className="md:col-span-2">
              <Button className="w-full" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Creating account…' : 'Sign up'}
              </Button>
            </div>
          </form>
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Already registered?{' '}
            <Link className="text-primary underline" to="/login">
              Sign in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignupPage;

