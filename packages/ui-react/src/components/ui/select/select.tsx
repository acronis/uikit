// `Select` is an alias of the next-gen `InputSelect` family (themed by the
// `--ui-input-select-*` tier). It previously bound the deleted `--ui-form-*` tier and
// rendered with unresolved colors (issue #333); re-pointing the `Select*` names at the
// themed `InputSelect*` parts resolves that without maintaining a second Base UI Select
// wrapper. Prefer importing `InputSelect*` directly in new code.
export {
  InputSelect as Select,
  InputSelectTrigger as SelectTrigger,
  InputSelectValue as SelectValue,
  InputSelectContent as SelectContent,
  InputSelectItem as SelectItem,
  InputSelectSection as SelectGroup,
  InputSelectSectionLabel as SelectGroupLabel,
} from '../input-select';
