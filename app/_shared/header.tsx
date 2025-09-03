export const Header = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-lg font-medium">Valentin Cassarino</h1>
      <div className="space-y-6 text-sm text-stone-600 *:leading-[22px]">
        <p>Hey there *waves*</p>
        <p>I&apos;m an economist turned design engineer based in Argentina.</p>
        <span className="block">
          Currently working at{" "}
          <a
            href="https://yakoa.io"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-800 transition-colors"
          >
            Yakoa
          </a>
          , powering the best IP protection for the blockchain. My work at Yakoa
          is pretty straightforward: translate complex interactions to simple
          user experiences and bring them to life. Before that, I led the
          front-end team at Selehann.
        </span>
        <p>
          In my free time I enjoy going to the gym and reading (lots of
          reading). If you&apos;re into high-fantasy books just like me, I
          can&apos;t recommend{" "}
          <a
            href="https://brandonsanderson.com/"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-stone-800 transition-colors"
          >
            Brandon Sanderson
          </a>{" "}
          more.
        </p>
      </div>
    </div>
  );
};
