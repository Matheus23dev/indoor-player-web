import { Card, CardContent, CardHeader } from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import { Label } from "@radix-ui/react-label";
import { LockKeyhole, User } from "lucide-react";
import { LoaderButton } from "../../../../components/common/LoaderButton";
import { Colors } from "../../../../constants";
import { useSignIn } from "../../hooks/useSignIn";

const SignInForm = () => {
  const {
    email,
    setEmail,
    password,
    setPassword,
    loading,
    buttonRef,
    handleSignIn,
  } = useSignIn();

  return (
    <Card className="w-full xl:w-md 2xl:w-xl max-w-xl">
      <div className="flex flex-col gap-5 md:mb-20">
        <img className="w-35 md:w-50 flex xl:hidden m-auto" src="/src/assets/images/TIjuca-Track.png" alt="Logo Tijuca" />
        <h1 className="text-white text-4xl text-center m-auto xl:text-left xl:text-6xl font-bold">TIJUCA TRACK</h1>
        <p className="text-white hidden m-auto w-[500px] xl:flex md:text-2xl text-3xl">
          Controle e eficiência nas Viagens feitas pelos seus veículos.
        </p>
      </div>

      <CardHeader />

      <CardContent className="flex flex-col gap-5">
        <form onSubmit={handleSignIn} className="flex flex-col gap-5">
          <div>
            <Label className="text-white" htmlFor="email">E-mail</Label>
            <Input
              icon={<User color="#1F53AD" />}
              className="bg-white"
              id="email"
              placeholder="exemplo@gmail.com"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <Label className="text-white" htmlFor="password">Senha</Label>
            <Input
              icon={<LockKeyhole color="#1F53AD" />}
              id="password"
              placeholder="Digite sua senha"
              type="password"
              showTogglePassword
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
          </div>

          <div className="flex justify-center mt-8">
              <LoaderButton
                ref={buttonRef}
                onPress={handleSignIn}
                type="submit"
                buttonText={loading ? "Entrando..." : "Entrar"}
                bgColor={Colors.amarelo}
                color={Colors.branco}
              />
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignInForm;
