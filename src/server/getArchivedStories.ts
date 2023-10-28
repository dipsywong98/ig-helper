import { IgApiClient } from 'instagram-private-api';

interface ArchiveResponseBody {
  'items': Array<ArchieveItem>
  'num_results': number,
  'more_available': boolean,
  'max_id': null,
  'memories': {
    'items': []
  },
  'status': 'ok'
}

interface ArchieveItem {
  'timestamp': number,
  'media_count': number,
  'id': string,
  'reel_type': 'archive_day_reel',
  'latest_reel_media': number
}

const archiveApiUrl = '/api/v1/archive/reel/day_shells/?include_suggested_highlights=false&is_in_archive_home=true&include_cover=0';

// eslint-disable-next-line max-len
export const getArchivedStories = async (ig: IgApiClient): Promise<ArchieveItem[]> => ig.request.send({ url: archiveApiUrl })
  .then((response) => response.body)
  .then((body: ArchiveResponseBody) => body.items);
