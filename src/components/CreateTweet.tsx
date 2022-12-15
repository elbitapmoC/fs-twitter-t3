import { FormEventHandler, useState } from "react";
import { object, string } from "zod";
import { trpc } from "../utils/trpc";
import { FaTwitter } from "react-icons/fa";

export const tweetSchema = object({
  text: string({
    required_error: "Tweet text is required",
  })
    .min(10)
    .max(280),
});

export function CreateTweet() {
  const [text, setText] = useState("");
  const [error, setError] = useState("");

  const utils = trpc.useContext();

  const { mutateAsync } = trpc.tweet.create.useMutation({
    onSuccess: () => {
      setText("");
      utils.tweet.timeline.invalidate();
    },
  });

  async function handleSubmit(e: any) {
    e.preventDefault();

    try {
      await tweetSchema.parse({ text });
    } catch (e: any) {
      setError(e.message);
      return;
    }

    mutateAsync({ text });
  }

  return (
    <>
      {error && JSON.stringify(error)}
      <form
        onSubmit={handleSubmit}
        className="mt-8 flex w-full flex-col rounded-md"
      >
        <textarea
          placeholder="What's happening?"
          className="w-full resize-none rounded border border-gray-400 p-4 shadow"
          onChange={(e) => setText(e.target.value)}
        />

        <aside className="mt-4 mb-12 flex justify-end">
          <button
            className="rounded-md bg-sky-400 px-4 py-2 text-white"
            type="submit"
          >
            <span className="flex items-center gap-2">
              <FaTwitter /> Tweet
            </span>
          </button>
        </aside>
      </form>
    </>
  );
}
