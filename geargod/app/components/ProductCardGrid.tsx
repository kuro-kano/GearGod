import { Card, CardHeader, Image } from "@heroui/react";

export default function ProductCardGrid() {
  return (
    <div className="max-w-[850px] max-h-[700px] gap-2 grid grid-cols-12 grid-rows-2 px-8 pt-14 pr-12">
      <Card className="col-span-12 sm:col-span-4 h-[300px] overflow-hidden">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start p-3 inset-0 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Pro Gaming Headset
          </p>
          <h4 className="text-white font-medium text-large">
            Crystal-clear audio, noise cancellation
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="images/headset/Beyerdynamic-DT1990-PRO-MKII.jpg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px] overflow-hidden">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start p-3 inset-0 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            High-Precision Gaming Mouse
          </p>
          <h4 className="text-white font-medium text-large">
            Ultra-fast response, customizable RGB
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="images/mouse/helios_mouse.jpg"
        />
      </Card>
      <Card className="col-span-12 sm:col-span-4 h-[300px] overflow-hidden">
        <CardHeader className="absolute z-10 top-1 flex-col !items-start p-3 inset-0 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Keyboard
          </p>
          <h4 className="text-white font-medium text-large">
            Design your own case, choose colors, RGB, and materials
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card background"
          className="z-0 w-full h-full object-cover"
          src="images/keyboard/rainy-75-standard-blue.jpg"
        />
      </Card>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-5 overflow-hidden"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start p-3 inset-0 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Custom PC Case Builder
          </p>
          <h4 className="text-white font-medium text-large">
            Headset, keyboard, mouse, and mousepad
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Card example background"
          className="z-0 w-full h-full object-fit"
          src="images/pc-case/cherry-blossom-case.jpg"
        />
      </Card>
      <Card
        isFooterBlurred
        className="w-full h-[300px] col-span-12 sm:col-span-7 overflow-hidden"
      >
        <CardHeader className="absolute z-10 top-1 flex-col items-start p-3 inset-0 bg-gradient-to-b from-black/80 to-transparent">
          <p className="text-tiny text-white/60 uppercase font-bold">
            Build Your Dream Setup
          </p>
          <h4 className="text-white/90 font-medium text-lg">
            Custom gaming desk & accessories
          </h4>
        </CardHeader>
        <Image
          removeWrapper
          alt="Relaxing app background"
          className="z-0 w-full h-full object-cover"
          src="images/desk-setup/desk-setup.jpg"
        />
      </Card>
    </div>
  );
}
