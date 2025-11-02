import { SimpleDialogProps } from "@/src/utilities";
import { canvasPreview } from "./canvasPreview";
import { useState, useRef, useEffect,  } from "react";
import ReactCrop, { type Crop, PixelCrop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";
import { Button } from "@/components/ui/button";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Slider } from "@/components/ui/slider";
import Image from "next/image";
import { Upload } from "lucide-react";

function ProfilePictureDialogue(props: SimpleDialogProps) {
  const { onClose, imageSrc } = props;
  const [scalevalue, setScalevalue] = useState(1);
  const [crop, setCrop] = useState<Crop>({
    unit: "px", // Can be 'px' or '%'
    x: 25,
    y: 25,
    width: 150,
    height: 150,
  });
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [croppedImageSize, setCroppedImageSize] = useState(0);

  const handleSubmit = (type: "upload" | undefined) => {
    if (type === "upload" && previewCanvasRef?.current) {
      onClose(previewCanvasRef?.current.toDataURL());
    }
    handleCancel();
  };

  const handleSliderChange = (newValue: number | number[]) => {
    setScalevalue(newValue as number);
  };

  useEffect(() => {
    if (
      completedCrop?.width &&
      completedCrop?.height &&
      imgRef.current &&
      previewCanvasRef.current
    ) {
      // We use canvasPreview as it's much faster than imgPreview.
      setTimeout(() => {
        canvasPreview(
          imgRef?.current as HTMLImageElement,
          previewCanvasRef?.current as HTMLCanvasElement,
          completedCrop,
          scalevalue
        );
      }, 100);
    }
  }, [completedCrop, scalevalue]);

  const handleCancel = () => {
    setScalevalue(1);
    onClose();
  };

  useEffect(() => {
    const canvas = previewCanvasRef?.current;
    if (!canvas) {
      setCroppedImageSize(0);
      return;
    }
    canvas.toBlob((blob) => {
      setCroppedImageSize(blob?.size || 0);
    }, "image/png");
  }, [previewCanvasRef?.current, completedCrop, scalevalue]);

  return (
    <>
      <DialogContent className="w-3/4">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <div className="p-moderate flex flex-col items-center gap-3">
          {imageSrc !== "" ? (
            <>
              <ReactCrop
                crop={crop}
                maxWidth={150}
                maxHeight={150}
                aspect={1}
                onChange={(c: Crop) => {
                  setCrop(c);
                }}
                style={{ minHeight: 150, maxHeight: 400, width: 400 }}
                onComplete={(c: PixelCrop) => setCompletedCrop(c)}
                className="flex flex-col items-center justify-center rounded-md overflow-hidden"
              >
                <img
                  ref={imgRef}
                  src={imageSrc}
                  alt="Profile picture selected for cropping"
                  style={{
                    transform: `scale(${scalevalue})`,
                    transition: "transform 0.25s ease-in-out",
                  }}
                  className="w-full h-full object-contain"
                />
              </ReactCrop>
              <div className="w-full-0.9 flex flex-col gap-2">
                <span className="text-darkGrey mt-moderate w-full flex flex-col items-center">
                  Scale Image ({(scalevalue * 100).toFixed(2)}%)
                </span>
                <Slider
                  defaultValue={[1]}
                  max={1.5}
                  min={0.5}
                  step={0.05}
                  onValueChange={handleSliderChange}
                />
              </div>
            </>
          ) : (
            <></>
          )}
        </div>
        <DialogFooter>
          <div className="flex items-center w-full justify-evenly my-moderate py-moderate divide-x divide-border/40">
            <div className="flex-[0.6] flex items-center gap-4">
              <canvas
                className="rounded-full"
                ref={previewCanvasRef}
                style={{
                  objectFit: "contain",
                  width: completedCrop?.width || 150,
                  height: completedCrop?.width || 150,
                }}
              />
              <section className="flex flex-col gap-3">
                <span className="text-[12px]">
                  <strong>Size:</strong>
                  <br />{" "}
                  {croppedImageSize?.toString()?.length > 6
                    ? `${(croppedImageSize / 1000000)?.toFixed(2)} Mb`
                    : `${(croppedImageSize / 1000)?.toFixed(2)} Kb`}
                </span>
                <span className={`text-[12px] ${croppedImageSize > 1000000 ? "text-red-700" : "text-green-700"}`}>
                  <strong>Limit:</strong>
                  <br />{" "}
                  1.00 Mb
                </span>
              </section>
            </div>
            <div className="flex-[0.4] flex items-center flex-col gap-3">
              <DialogClose
                onClick={handleCancel}
                color="warning"
                className="bg-red-100 text-red-700 cursor-pointer text-sm font-medium p-2 rounded-md"
              >
                Cancel
              </DialogClose>
              <Button
              disabled={croppedImageSize > 1048487}
                className="bg-green-100 text-green-700 hover:bg-green-100 hover:text-green-700 text-sm font-medium "
                onClick={() => handleSubmit("upload")}
              >
                Upload
              </Button>
              <Button
                variant={"outline"}
                className="text-sm font-medium "
                onClick={() => handleSubmit("upload")}
              >
                <Upload />
                Choose Again
              </Button>
            </div>
          </div>
        </DialogFooter>
      </DialogContent>
    </>
  );
}

export default ProfilePictureDialogue;
