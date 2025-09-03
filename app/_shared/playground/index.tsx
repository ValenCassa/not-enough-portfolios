import InstagramRecording from "./instagram-recording";
import { NftContractPreview } from "./nft-contract-preview";
import { OTPVerification } from "./otp-verification";
import { PlaygroundItem, PlaygroundItemContainer } from "./playground-item";
import { PromptCommand } from "./prompt-command";

export const Playground = () => {
  return (
    <section className="space-y-6">
      <h2 className="text-sm font-medium text-stone-700">~/ playground</h2>
      <PlaygroundItem
        title="NFT Contract Preview"
        description="Interactive preview animation for an NFT collection showcase"
      >
        <PlaygroundItemContainer
          codesandbox="https://codesandbox.io/p/sandbox/wfs2s3?file=%2Fsrc%2FApp.tsx%3A1%2C1-270%2C1"
          className="h-[300px]"
        >
          <NftContractPreview />
        </PlaygroundItemContainer>
      </PlaygroundItem>
      <PlaygroundItem
        title="Instagram Recording"
        description="Web recreation of Instagram's iconic recording animation interface"
      >
        <PlaygroundItemContainer codesandbox="https://codesandbox.io/p/devbox/cassa-animation-forked-2nzc33?file=%2Fsrc%2FApp.tsx%3A1%2C1-1021%2C1">
          <InstagramRecording />
        </PlaygroundItemContainer>
      </PlaygroundItem>
      <PlaygroundItem
        title="OTP Verification"
        description="Animated OTP code verification with smooth micro-interactions"
      >
        <PlaygroundItemContainer
          codesandbox="https://codesandbox.io/p/devbox/cassa-animation-forked-x9g38x"
          className="h-[350px]"
        >
          <OTPVerification />
        </PlaygroundItemContainer>
      </PlaygroundItem>
      <PlaygroundItem
        title="Prompt Command"
        description="Interactive command-line interface for prompt execution"
      >
        <PlaygroundItemContainer className="h-[300px] sm:hidden">
          <p className="text-sm text-stone-500">
            Only available on desktop devices
          </p>
        </PlaygroundItemContainer>
        <PlaygroundItemContainer
          codesandbox="https://codesandbox.io/p/devbox/cassa-animation-forked-66e347"
          className="h-[350px] max-sm:hidden"
        >
          <PromptCommand />
        </PlaygroundItemContainer>
      </PlaygroundItem>
    </section>
  );
};
