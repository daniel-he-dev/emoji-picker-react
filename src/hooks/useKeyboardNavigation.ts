import { useEffect } from 'react';
import {
  useBodyRef,
  useCategoryNavigationRef,
  usePickerMainRef,
  useSearchInputRef,
  useSkinTonePickerRef
} from '../components/context/ElementRefContext';
import { useSkinToneFanOpenState } from '../components/context/PickerContext';
import {
  focusFirstVisibleEmoji,
  focusNextElementSibling,
  focusPrevElementSibling,
  getActiveElement,
  hasNextElementSibling
} from '../DomUtils/keyboardNavigation';
import { useScrollTo } from '../DomUtils/scrollTo';
import { useCloseAllOpenToggles } from './useCloseAllOpenToggles';
import { useClearSearch } from './useFilter';
import {
  useFocusCategoryNavigation,
  useFocusSearchInput,
  useFocusSkinTonePicker
} from './useFocus';

export function useKeyboardNavigation() {
  usePickerMainKeyboardEvents();
  useSearchInputKeyboardEvents();
  useSkinTonePickerKeyboardEvents();
  useCategoryNavigationKeyboardEvents();
}

function usePickerMainKeyboardEvents() {
  const PickerMainRef = usePickerMainRef();
  const clearSearch = useClearSearch();
  const scrollTo = useScrollTo();
  const SearchInputRef = useSearchInputRef();
  const focusSearchInput = useFocusSearchInput();

  const {
    closeAllOpenToggles,
    dependencyArray: CloseTogglesDependencyArray
  } = useCloseAllOpenToggles();

  useEffect(() => {
    const current = PickerMainRef.current;

    if (!current) {
      return;
    }

    current.addEventListener('keydown', onKeyDown);

    return () => {
      current.removeEventListener('keydown', onKeyDown);
    };
  }, [
    PickerMainRef.current,
    SearchInputRef.current,
    scrollTo,
    ...CloseTogglesDependencyArray
  ]);

  function onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    if (key === 'Escape') {
      clearSearch();
      closeAllOpenToggles();
      scrollTo(0);
      focusSearchInput();
    }
  }
}

function useSearchInputKeyboardEvents() {
  const focusSkinTonePicker = useFocusSkinTonePicker();
  const PickerMainRef = usePickerMainRef();
  const SearchInputRef = useSearchInputRef();
  const [, setSkinToneFanOpenState] = useSkinToneFanOpenState();
  const focusCategoryNavigation = useFocusCategoryNavigation();

  useEffect(() => {
    const current = SearchInputRef.current;

    if (!current) {
      return;
    }

    current.addEventListener('keydown', onKeyDown);

    return () => {
      current.removeEventListener('keydown', onKeyDown);
    };
  }, [PickerMainRef.current, SearchInputRef.current]);

  function onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    switch (key) {
      case 'ArrowRight':
        setSkinToneFanOpenState(true);
        focusSkinTonePicker();
        break;
      case 'ArrowDown':
        focusCategoryNavigation();
        break;
    }
  }
}

function useSkinTonePickerKeyboardEvents() {
  const SkinTonePickerRef = useSkinTonePickerRef();
  const focusSearchInput = useFocusSearchInput();
  const SearchInputRef = useSearchInputRef();

  useEffect(() => {
    const current = SkinTonePickerRef.current;

    if (!current) {
      return;
    }

    current.addEventListener('keydown', onKeyDown);

    return () => {
      current.removeEventListener('keydown', onKeyDown);
    };
  }, [SkinTonePickerRef.current, SearchInputRef.current]);

  function onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    switch (key) {
      case 'ArrowLeft':
        focusNextSkinTone(focusSearchInput);
        break;
      case 'ArrowRight':
        focusPrevSkinTone();
        break;
    }
  }
}

function useCategoryNavigationKeyboardEvents() {
  const focusSearchInput = useFocusSearchInput();
  const CategoryNavigationRef = useCategoryNavigationRef();
  const BodyRef = useBodyRef();

  useEffect(() => {
    const current = CategoryNavigationRef.current;

    if (!current) {
      return;
    }

    current.addEventListener('keydown', onKeyDown);

    return () => {
      current.removeEventListener('keydown', onKeyDown);
    };
  }, [CategoryNavigationRef.current, BodyRef.current]);

  function onKeyDown(event: KeyboardEvent) {
    const { key } = event;

    switch (key) {
      case 'ArrowUp':
        focusSearchInput();
        break;
      case 'ArrowRight':
        focusNextElementSibling(getActiveElement());
        break;
      case 'ArrowLeft':
        focusPrevElementSibling(getActiveElement());
        break;
      case 'ArrowDown':
        focusFirstVisibleEmoji(BodyRef.current);
        break;
    }
  }
}

function focusNextSkinTone(exitLeft: () => void) {
  const currentSkinTone = getActiveElement();

  if (!currentSkinTone) {
    return;
  }

  if (!hasNextElementSibling(currentSkinTone)) {
    exitLeft();
  }

  focusNextElementSibling(currentSkinTone);
}

function focusPrevSkinTone() {
  const currentSkinTone = getActiveElement();

  if (!currentSkinTone) {
    return;
  }

  focusPrevElementSibling(currentSkinTone);
}

// const handleKeyDown = (event: KeyboardEvent) => {
//   switch (event.key) {
//     case 'Enter':
//       onEnter?.();
//       break;
//     case 'Escape':
//       onEscape?.();
//       break;
//     case ' ':
//       onSpace?.();
//       break;
//     case 'Tab':
//       onTab?.();
//       break;
//     case 'ArrowUp':
//       onUp?.();
//       break;
//     case 'ArrowDown':
//       onDown?.();
//       break;
//     case 'ArrowLeft':
//       onLeft?.();
//       break;
//     case 'ArrowRight':
//       onRight?.();
//       break;
//   }
// };
