"use client";

export default function NewsletterForm() {
  return (
    <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
      <input
        type="email"
        placeholder="your@email.com"
        className="flex-1 px-5 py-4 rounded-2xl bg-[#FDF6E3] text-[#5C3317] font-medium outline-none focus:ring-4 focus:ring-[#ffc0cb] placeholder-[#5C3317]/50"
      />
      <button
        type="submit"
        className="px-8 py-4 bg-[#ffc0cb] text-[#00008B] font-black rounded-2xl hover:bg-[#FDF6E3] transition-colors"
      >
        SUBSCRIBE
      </button>
    </form>
  );
}
