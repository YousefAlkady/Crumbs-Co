'use client';

import { motion } from 'framer-motion';
import type { Product } from '@/types/products';

interface CookieCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

export default function CookieCard({ product, onAddToCart }: CookieCardProps) {
  const isAvailable = product.is_available;

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      whileTap={{ y: 2, transition: { duration: 0.1 } }}
      className={`
        flex flex-col items-center text-center
        rounded-2xl border-4 border-chocolate bg-white
        shadow-sticker hover:shadow-sticker-hover p-5
        transition-shadow duration-150
        ${!isAvailable ? 'opacity-60' : ''}
      `}
    >
      {/* Image container - sticker style */}
      <div className="relative w-full aspect-square max-h-[280px] rounded-2xl border-4 border-chocolate bg-pastel-peach overflow-hidden mb-4 shadow-sticker">
        {!isAvailable && (
          <div
            className="absolute inset-0 z-10 flex items-center justify-center"
            aria-hidden
          >
            <motion.span
              initial={{ scale: 0.8, rotate: -8 }}
              animate={{ scale: 1, rotate: -10 }}
              className="bg-chocolate text-white px-4 py-2 rounded-xl font-chewy text-xl shadow-sticker"
            >
              SOLD OUT
            </motion.span>
          </div>
        )}
        {product.image_url ? (
          <motion.img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover"
            whileHover={isAvailable ? { scale: 1.05 } : {}}
            transition={{ duration: 0.2 }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl">
            🍪
          </div>
        )}
      </div>

      {/* Name */}
      <h3 className="font-chewy text-2xl text-pastel-hotpink mb-1">
        {product.name}
      </h3>

      {/* Description */}
      {product.description && (
        <p className="text-chocolate/80 text-sm mb-3 font-fredoka">
          {product.description}
        </p>
      )}

      {/* Price & Add button */}
      <div className="flex items-center gap-3 mt-auto">
        <span className="font-chewy text-xl text-chocolate">
          {product.price} LE
        </span>
        {isAvailable ? (
          <motion.button
            onClick={() => onAddToCart(product)}
            whileTap={{ x: 4, y: 4 }}
            className="
              bg-pastel-hotpink text-white font-fredoka font-semibold text-base
              px-5 py-2.5 rounded-full
              border-4 border-chocolate
              shadow-sticker hover:shadow-sticker-hover active:shadow-sticker-pressed
              cursor-pointer transition-all duration-150
            "
          >
            ADD +
          </motion.button>
        ) : (
          <button
            disabled
            className="
              bg-gray-300 text-white font-fredoka font-semibold text-base
              px-5 py-2.5 rounded-full
              border-4 border-chocolate
              cursor-not-allowed opacity-80
            "
          >
            SOLD OUT
          </button>
        )}
      </div>
    </motion.article>
  );
}
