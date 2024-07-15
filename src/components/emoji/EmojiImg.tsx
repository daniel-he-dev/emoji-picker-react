import { cx } from 'flairup';
import * as React from 'react';
import { useDrag } from 'react-dnd';

import { stylesheet } from '../../Stylesheet/stylesheet';
import { EmojiStyle } from '../../types/exposedTypes';

import { emojiStyles } from './emojiStyles';

export function EmojiImg({
  unified,
  emojiName,
  style,
  lazyLoad = false,
  imgUrl,
  onError,
  className
}: {
  unified?: string;
  emojiName: string;
  emojiStyle: EmojiStyle;
  style: React.CSSProperties;
  lazyLoad?: boolean;
  imgUrl: string;
  onError: () => void;
  className?: string;
}) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: 'Emoji',
    item: { unified },
    collect: monitor => ({
      isDragging: !!monitor.isDragging()
    })
  }));

  return (
    <img
      ref={drag}
      src={imgUrl}
      alt={emojiName}
      className={cx(
        styles.emojiImag,
        emojiStyles.external,
        emojiStyles.common,
        className
      )}
      loading={lazyLoad ? 'lazy' : 'eager'}
      onError={onError}
      style={style}
    />
  );
}

const styles = stylesheet.create({
  emojiImag: {
    '.': 'epr-emoji-img',
    maxWidth: 'var(--epr-emoji-fullsize)',
    maxHeight: 'var(--epr-emoji-fullsize)',
    minWidth: 'var(--epr-emoji-fullsize)',
    minHeight: 'var(--epr-emoji-fullsize)',
    padding: 'var(--epr-emoji-padding)'
  }
});
