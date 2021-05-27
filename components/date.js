import { parseISO, format } from 'date-fns';
import pl from 'date-fns/locale/pl';

export default function Date({ dateString }) {
  const date = parseISO(dateString);
  const opts = { locale: pl };
  return <time dateTime={dateString}>{format(date, 'd LLL yyyy', opts)}</time>
}