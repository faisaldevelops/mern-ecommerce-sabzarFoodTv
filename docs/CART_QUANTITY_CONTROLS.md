# Cart Quantity Control Enhancement

## Overview

Enhanced the ProductCard component to allow users to increase or decrease product quantities directly from the product listing page.

## Changes Made

### Before
- Product cards only had an "Add to Cart" button
- Each click added one more item to the cart
- No visual feedback showing quantity in cart
- Had to go to cart page to adjust quantities

### After
- Initial state: "Add to Cart" button
- After first click: Button transforms to +/- quantity controls
- Shows current quantity in cart
- Click "-" to decrease (when 0, reverts to "Add to Cart" button)
- Click "+" to increase quantity
- Real-time cart updates

## User Flow

```
┌─────────────────────────────────────┐
│  Product Card (quantity = 0)        │
│                                     │
│  [🛒 Add to Cart]  [⚡ Buy Now]    │
└─────────────────────────────────────┘
                ↓ (click Add to Cart)
┌─────────────────────────────────────┐
│  Product Card (quantity = 1)        │
│                                     │
│  [ - ] [ 1 ] [ + ]  [⚡ Buy Now]   │
└─────────────────────────────────────┘
                ↓ (click +)
┌─────────────────────────────────────┐
│  Product Card (quantity = 2)        │
│                                     │
│  [ - ] [ 2 ] [ + ]  [⚡ Buy Now]   │
└─────────────────────────────────────┘
                ↓ (click - twice)
┌─────────────────────────────────────┐
│  Product Card (quantity = 0)        │
│                                     │
│  [🛒 Add to Cart]  [⚡ Buy Now]    │
└─────────────────────────────────────┘
```

## Technical Implementation

### File Modified
- `frontend/src/components/ProductCard.jsx`

### Key Changes

1. **Import Additional Icons**
   ```javascript
   import { Plus, Minus } from "lucide-react";
   ```

2. **Access Cart State**
   ```javascript
   const { addToCart, cart, updateQuantity } = useCartStore();
   const cartItem = cart.find(item => item._id === product._id);
   const quantityInCart = cartItem ? cartItem.quantity : 0;
   ```

3. **New Handler Functions**
   ```javascript
   const handleIncreaseQuantity = () => {
     updateQuantity(product._id, quantityInCart + 1);
   };
   
   const handleDecreaseQuantity = () => {
     if (quantityInCart > 0) {
       updateQuantity(product._id, quantityInCart - 1);
     }
   };
   ```

4. **Conditional Rendering**
   - Show "Add to Cart" button when `quantityInCart === 0`
   - Show +/- controls when `quantityInCart > 0`
   - Automatically reverts when quantity decreases to 0

## Benefits

✅ **Better UX**: Users can adjust quantities without leaving the product page  
✅ **Visual Feedback**: Clear indication of items already in cart  
✅ **Fewer Clicks**: Direct quantity adjustment from product listing  
✅ **Consistent**: Matches the UI pattern used in the cart page  
✅ **Intuitive**: Natural progression from button to quantity controls  

## UI Components

### Add to Cart Button (Initial State)
```jsx
<button className="flex-1 px-3 py-2.5 bg-stone-800 text-white">
  <ShoppingCart size={14} />
  Add to Cart
</button>
```

### Quantity Controls (After Adding)
```jsx
<div className="flex-1 flex items-center justify-center gap-2 border border-stone-300 rounded-md">
  <button onClick={handleDecreaseQuantity}>
    <Minus size={14} />
  </button>
  <span>{quantityInCart}</span>
  <button onClick={handleIncreaseQuantity}>
    <Plus size={14} />
  </button>
</div>
```

## Testing Considerations

When testing this feature:
1. Click "Add to Cart" - should see +/- controls appear
2. Click "+" multiple times - quantity should increase
3. Click "-" to reduce quantity - should decrease
4. Reduce to 0 - should revert to "Add to Cart" button
5. Check cart page - quantities should match
6. Refresh page - quantities should persist (cart state preserved)

## Edge Cases Handled

- ✅ Out of stock products - button disabled, no +/- controls
- ✅ Zero quantity - automatic revert to "Add to Cart" button  
- ✅ Stock validation - uses existing cart store logic
- ✅ Guest vs authenticated users - works with both cart modes
- ✅ Local storage sync - maintains guest cart persistence

## Styling

The quantity controls maintain visual consistency with:
- CartItem component (same button styling)
- Product card design system
- Stone color palette
- Border and hover effects matching existing UI
