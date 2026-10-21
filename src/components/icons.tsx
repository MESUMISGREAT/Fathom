/** Line icons drawn on a 24px grid. Decorative by default (aria-hidden). */
import type { ReactNode, SVGProps } from 'react';

type IconProps = SVGProps<SVGSVGElement> & { title?: string };

function make(name: string, body: ReactNode) {
  function Icon({ title, ...props }: IconProps) {
    return (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.75}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden={title ? undefined : true}
        role={title ? 'img' : undefined}
        focusable="false"
        {...props}
      >
        {title ? <title>{title}</title> : null}
        {body}
      </svg>
    );
  }
  Icon.displayName = `Icon(${name})`;
  return Icon;
}

export const HomeIcon = make('home', <><path d="M3.5 10.5 12 4l8.5 6.5" /><path d="M5.5 9v10.5h13V9" /><path d="M10 19.5v-5h4v5" /></>);
export const BookIcon = make('book', <><path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" /><path d="M4 20.5A2.5 2.5 0 0 1 6.5 18H20v3H6.5" /><path d="M9 7.5h7" /></>);
export const RepeatIcon = make('repeat', <><path d="M4 12a8 8 0 0 1 13.7-5.6L20 8.5" /><path d="M20 4v4.5h-4.5" /><path d="M20 12a8 8 0 0 1-13.7 5.6L4 15.5" /><path d="M4 20v-4.5h4.5" /></>);
export const SearchIcon = make('search', <><circle cx="11" cy="11" r="6.5" /><path d="m20 20-4.2-4.2" /></>);
export const BookmarkIcon = make('bookmark', <path d="M6.5 3.5h11v17L12 16.5l-5.5 4z" />);
export const BookmarkFilledIcon = make('bookmark-filled', <path d="M6.5 3.5h11v17L12 16.5l-5.5 4z" fill="currentColor" />);
export const ChartIcon = make('chart', <><path d="M4 20h16" /><path d="M7 16v-5" /><path d="M12 16V7" /><path d="M17 16v-8" /></>);
export const ClockIcon = make('clock', <><circle cx="12" cy="12" r="8.5" /><path d="M12 7.5V12l3 2" /></>);
export const SettingsIcon = make(
  'settings',
  <>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-1.8-.3 1.6 1.6 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-1-1.5 1.6 1.6 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0 .3-1.8 1.6 1.6 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.5-1 1.6 1.6 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 1.8.3H9a1.6 1.6 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 1 1.5 1.6 1.6 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0-.3 1.8V9a1.6 1.6 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.5 1z" />
  </>,
);
export const PencilIcon = make('pencil', <><path d="M14.5 5.5 18.5 9.5" /><path d="M4 20l1-4.5L16 4.5a1.4 1.4 0 0 1 2 0l1.5 1.5a1.4 1.4 0 0 1 0 2L8.5 19z" /></>);
export const ChatIcon = make('chat', <><path d="M20 12a7.5 7.5 0 0 1-11 6.6L4.5 20l1.4-4.3A7.5 7.5 0 1 1 20 12z" /><path d="M9 11h.01M12 11h.01M15 11h.01" /></>);
export const GridIcon = make('grid', <><rect x="4" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="4" width="6.5" height="6.5" rx="1.5" /><rect x="4" y="13.5" width="6.5" height="6.5" rx="1.5" /><rect x="13.5" y="13.5" width="6.5" height="6.5" rx="1.5" /></>);
export const ChevronRightIcon = make('chevron-right', <path d="m9.5 6 6 6-6 6" />);
export const ChevronLeftIcon = make('chevron-left', <path d="m14.5 6-6 6 6 6" />);
export const ArrowRightIcon = make('arrow-right', <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>);
export const CheckIcon = make('check', <path d="m5 12.5 4.5 4.5L19 7.5" />);
export const XIcon = make('x', <><path d="M6 6l12 12" /><path d="M18 6 6 18" /></>);
export const CheckCircleIcon = make('check-circle', <><circle cx="12" cy="12" r="8.5" /><path d="m8.3 12.3 2.6 2.6 4.9-5.4" /></>);
export const XCircleIcon = make('x-circle', <><circle cx="12" cy="12" r="8.5" /><path d="m9.2 9.2 5.6 5.6M14.8 9.2l-5.6 5.6" /></>);
export const HalfCircleIcon = make('half-circle', <><circle cx="12" cy="12" r="8.5" /><path d="M12 3.5v17A8.5 8.5 0 0 0 12 3.5z" fill="currentColor" stroke="none" /></>);
export const AlertIcon = make('alert', <><path d="M10.3 4.3 2.9 17.2A2 2 0 0 0 4.6 20h14.8a2 2 0 0 0 1.7-2.8L13.7 4.3a2 2 0 0 0-3.4 0z" /><path d="M12 9.5v4M12 17h.01" /></>);
export const InfoIcon = make('info', <><circle cx="12" cy="12" r="8.5" /><path d="M12 11v5M12 8h.01" /></>);
export const BulbIcon = make('bulb', <><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.6 10.8c.6.5 1 1.2 1.1 2l.1.7h4.8l.1-.7c.1-.8.5-1.5 1.1-2A6 6 0 0 0 12 3z" /></>);
export const TargetIcon = make('target', <><circle cx="12" cy="12" r="8.5" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>);
export const FlagIcon = make('flag', <><path d="M5 21V4" /><path d="M5 4.5h11l-2 4 2 4H5" /></>);
export const SparkIcon = make('spark', <><path d="M12 3.5 13.8 9 19.5 10.5 13.8 12 12 17.5 10.2 12 4.5 10.5 10.2 9z" /><path d="M18.5 16.5l.7 1.8 1.8.7-1.8.7-.7 1.8-.7-1.8-1.8-.7 1.8-.7z" /></>);
export const LayersIcon = make('layers', <><path d="m12 3.5 8.5 4.5-8.5 4.5L3.5 8z" /><path d="m3.5 12 8.5 4.5 8.5-4.5" /><path d="m3.5 16 8.5 4.5 8.5-4.5" /></>);
export const UserIcon = make('user', <><circle cx="12" cy="8.5" r="4" /><path d="M4.5 20.5a7.5 7.5 0 0 1 15 0" /></>);
export const ShieldIcon = make('shield', <><path d="M12 3.5 19 6v5.5c0 4.3-3 7.8-7 9-4-1.2-7-4.7-7-9V6z" /><path d="m9 12 2.2 2.2L15.5 10" /></>);
export const LogoutIcon = make('logout', <><path d="M14 4.5h4.5v15H14" /><path d="M10.5 16.5 6 12l4.5-4.5" /><path d="M6 12h10" /></>);
export const ListIcon = make('list', <><path d="M9 6.5h11M9 12h11M9 17.5h11" /><path d="M4.5 6.5h.01M4.5 12h.01M4.5 17.5h.01" /></>);
export const PlayIcon = make('play', <path d="M8 5.5v13l10.5-6.5z" />);
export const LockIcon = make('lock', <><rect x="5" y="10.5" width="14" height="10" rx="2" /><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5" /></>);
export const DownloadIcon = make('download', <><path d="M12 4v11" /><path d="m7.5 10.5 4.5 4.5 4.5-4.5" /><path d="M5 19.5h14" /></>);
export const TrashIcon = make('trash', <><path d="M4.5 7h15" /><path d="M9.5 7V4.5h5V7" /><path d="M6.5 7l1 13h9l1-13" /></>);
export const SunIcon = make('sun', <><circle cx="12" cy="12" r="4" /><path d="M12 2.5v2M12 19.5v2M4.6 4.6l1.4 1.4M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4 6 18M18 6l1.4-1.4" /></>);
export const MoonIcon = make('moon', <path d="M19.5 14.5A8 8 0 0 1 9.5 4.5a8 8 0 1 0 10 10z" />);
export const CircleIcon = make('circle', <circle cx="12" cy="12" r="8.5" />);
export const DotsIcon = make('dots', <><circle cx="12" cy="12" r="8.5" /><path d="M8.5 12h.01M12 12h.01M15.5 12h.01" /></>);
export const RefreshIcon = make('refresh', <><path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3" /><path d="M19.5 4.5v4h-4" /></>);

// Points, badges and preferences
export const StarIcon = make('star', <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" />);
export const StarFilledIcon = make('star-filled', <path d="m12 3.8 2.5 5.1 5.6.8-4 4 .9 5.6-5-2.7-5 2.7.9-5.6-4-4 5.6-.8z" fill="currentColor" />);
export const BoltIcon = make('bolt', <path d="M13.5 3 5.5 13.5h6L10.5 21l8-10.5h-6z" />);
export const MedalIcon = make('medal', <><path d="M8 3.5h8l-2.3 6M8 3.5l2.3 6" /><circle cx="12" cy="15" r="5.5" /><path d="m12 12.6.8 1.6 1.8.3-1.3 1.2.3 1.8-1.6-.8-1.6.8.3-1.8-1.3-1.2 1.8-.3z" /></>);
export const TrophyIcon = make('trophy', <><path d="M7.5 4h9v5a4.5 4.5 0 0 1-9 0z" /><path d="M7.5 6H4.5a3 3 0 0 0 3 3.5M16.5 6h3a3 3 0 0 1-3 3.5" /><path d="M12 13.5V17M8.5 20.5h7M9.5 20.5l.5-3.5h4l.5 3.5" /></>);
export const CalendarIcon = make('calendar', <><rect x="4" y="5.5" width="16" height="14.5" rx="2.5" /><path d="M8 3.5v4M16 3.5v4M4 10h16" /><path d="M8.5 14h.01M12 14h.01M15.5 14h.01M8.5 17h.01M12 17h.01" /></>);
export const CompassIcon = make('compass', <><circle cx="12" cy="12" r="8.5" /><path d="m15.5 8.5-2 5-5 2 2-5z" /></>);
export const VolumeIcon = make('volume', <><path d="M4.5 9.5h3l4-3.5v12l-4-3.5h-3z" /><path d="M15 9.5a3.5 3.5 0 0 1 0 5M17.5 7a7 7 0 0 1 0 10" /></>);
export const SparklesIcon = make('sparkles', <><path d="M10 4.5 11.4 9l4.6 1.5-4.6 1.4L10 16.5 8.6 12 4 10.5 8.6 9z" /><path d="M17.5 3.5l.6 1.8 1.9.7-1.9.6-.6 1.9-.6-1.9L15 6l1.9-.7zM17 14.5l.7 2 2 .8-2 .7-.7 2-.7-2-2-.7 2-.8z" /></>);
export const EyeIcon = make('eye', <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" /><circle cx="12" cy="12" r="3" /></>);
export const GoalIcon = make('goal', <><circle cx="11" cy="13" r="7.5" /><circle cx="11" cy="13" r="3.5" /><path d="m11 13 8-8M16 5h3v3" /></>);
export const ArrowUpIcon = make('arrow-up', <><path d="M12 19V5" /><path d="m6 11 6-6 6 6" /></>);
export const PartyIcon = make('party', <><path d="M4 20 8.5 7.5l8 8z" /><path d="M13.5 4.5c.5 1.5 0 2.5-1 3M19.5 10.5c-1.5-.5-2.5 0-3 1M16 3.5v.01M20.5 7v.01M20 14v.01" /></>);
export const HeartIcon = make('heart', <path d="M12 19.5s-7.5-4.4-7.5-10A4.2 4.2 0 0 1 12 7a4.2 4.2 0 0 1 7.5 2.5c0 5.6-7.5 10-7.5 10z" />);

// Subject glyphs
export const SigmaIcon = make('sigma', <path d="M17.5 5.5h-11l6 6.5-6 6.5h11" />);
export const ChipIcon = make('chip', <><rect x="7" y="7" width="10" height="10" rx="1.5" /><path d="M10 10h4v4h-4z" /><path d="M10 3.5V7M14 3.5V7M10 17v3.5M14 17v3.5M3.5 10H7M3.5 14H7M17 10h3.5M17 14h3.5" /></>);
export const AtomIcon = make('atom', <><circle cx="12" cy="12" r="1.5" /><ellipse cx="12" cy="12" rx="9" ry="3.6" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(60 12 12)" /><ellipse cx="12" cy="12" rx="9" ry="3.6" transform="rotate(120 12 12)" /></>);
export const FlaskIcon = make('flask', <><path d="M9.5 3.5h5" /><path d="M10.5 3.5v5.5L5 18.5A1.6 1.6 0 0 0 6.4 21h11.2a1.6 1.6 0 0 0 1.4-2.5L13.5 9V3.5" /><path d="M7.5 15h9" /></>);

export const SUBJECT_ICONS: Record<string, (p: IconProps) => ReactNode> = {
  '9709': SigmaIcon,
  '9618': ChipIcon,
  '9702': AtomIcon,
  '9701': FlaskIcon,
};
