import { ListVideo } from "lucide-react";

interface Props {
  title: string;
  description: string;
}

export default function EmptyState({
  title,
  description,
}: Props) {
  return (
    <div
      className="
        bg-white
        border
        rounded-3xl
        py-20
        px-6
        text-center
      "
    >
      <div
        className="
          h-20
          w-20
          rounded-full
          bg-blue-100
          flex
          items-center
          justify-center
          mx-auto
          mb-5
        "
      >
        <ListVideo
          size={32}
          className="text-blue-600"
        />
      </div>

      <h2
        className="
          text-xl
          font-semibold
        "
      >
        {title}
      </h2>

      <p
        className="
          text-gray-500
          mt-2
        "
      >
        {description}
      </p>
    </div>
  );
}