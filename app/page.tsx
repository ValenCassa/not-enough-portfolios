import { Exploration } from "./_shared/exploration";
import { Header } from "./_shared/header";
import { Playground } from "./_shared/playground";
import { SayHi } from "./_shared/say-hi";

export default function Home() {
  return (
    <div className="px-4 py-4 min-[600px]:pt-[100px] min-[600px]:pb-6">
      <div className="max-w-[600px] mx-auto w-full space-y-16">
        <Header />
        <Playground />
        <Exploration />
        <SayHi />
      </div>
    </div>
  );
}
