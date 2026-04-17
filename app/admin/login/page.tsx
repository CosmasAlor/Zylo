import { AdminLoginForm } from "@/modules/admin/components/admin-login-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type LoginPageProps = {
  searchParams: Promise<{
    error?: string;
  }>;
};

export default async function AdminLoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const showError = params.error === "CredentialsSignin";

  return (
    <main className="container-app py-16">
      <div className="mx-auto max-w-md">
        <Card variant="default" spacing="lg">
          <CardHeader>
            <CardTitle>Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminLoginForm initialError={showError} />
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
