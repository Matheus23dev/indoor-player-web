export default function PlaylistSkeleton() {
  return (
    <div
      className="
        bg-white
        border
        rounded-3xl
        p-5
        animate-pulse
      "
    >
      <div className="flex justify-between items-start">

        <div>
          <div
            className="
              h-12
              w-12
              rounded-2xl
              bg-gray-200
              mb-4
            "
          />

          <div
            className="
              h-5
              w-40
              bg-gray-200
              rounded
            "
          />

          <div
            className="
              h-4
              w-20
              bg-gray-200
              rounded
              mt-3
            "
          />
        </div>

      </div>

      <div
        className="
          h-8
          w-28
          bg-gray-200
          rounded
          mt-5
        "
      />

      <div
        className="
          grid
          grid-cols-2
          gap-3
          mt-5
        "
      >
        <div
          className="
            h-20
            rounded-xl
            bg-gray-200
          "
        />

        <div
          className="
            h-20
            rounded-xl
            bg-gray-200
          "
        />
      </div>

      <div
        className="
          flex
          gap-2
          mt-6
        "
      >
        <div
          className="
            flex-1
            h-10
            rounded-xl
            bg-gray-200
          "
        />

        <div
          className="
            w-11
            h-10
            rounded-xl
            bg-gray-200
          "
        />
      </div>
    </div>
  );
}