import user from '@/apis/modules/user'
import note from '@/apis/modules/note'
import subject from '@/apis/modules/subject'
import discuss from '@/apis/modules/discuss'


export default {
  ...user,
  ...note,
  ...subject,
  ...discuss,
}
