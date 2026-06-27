export {
  Sheet,
  SheetTrigger,
  SheetPortal,
  SheetClose,
  SheetCloseButton,
  SheetOverlay,
  SheetContent,
  SheetHeader,
  SheetFooter,
  SheetBody,
  SheetTitle,
  SheetDescription,
  sheetVariants,
  type SheetContentProps,
} from './sheet';

// `Details*` is an alias family for `Sheet*`. The Vue UI kit called this side
// panel `Details`; the aliases give that migration a 1:1 drop-in. New code
// should prefer `Sheet`.
export {
  Sheet as Details,
  SheetTrigger as DetailsTrigger,
  SheetPortal as DetailsPortal,
  SheetClose as DetailsClose,
  SheetCloseButton as DetailsCloseButton,
  SheetOverlay as DetailsOverlay,
  SheetContent as DetailsContent,
  SheetHeader as DetailsHeader,
  SheetFooter as DetailsFooter,
  SheetBody as DetailsBody,
  SheetTitle as DetailsTitle,
  SheetDescription as DetailsDescription,
  type SheetContentProps as DetailsContentProps,
} from './sheet';
