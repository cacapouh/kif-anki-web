import { RecordMetadataKey } from "@/shogi";
import { ImmutableRecordMetadata } from "@/shogi/record";

export function defaultRecordFileName(
  metadata: ImmutableRecordMetadata
): string {
  let ret = getDateString(metadata);
  const title =
    metadata.getStandardMetadata(RecordMetadataKey.TITLE) ||
    metadata.getStandardMetadata(RecordMetadataKey.TOURNAMENT) ||
    metadata.getStandardMetadata(RecordMetadataKey.OPUS_NAME) ||
    metadata.getStandardMetadata(RecordMetadataKey.OPUS_NO) ||
    metadata.getStandardMetadata(RecordMetadataKey.PLACE) ||
    metadata.getStandardMetadata(RecordMetadataKey.POSTED_ON) ||
    metadata.getStandardMetadata(RecordMetadataKey.AUTHOR);
  if (title) {
    ret += "_" + title;
  }
  const black =
    metadata.getStandardMetadata(RecordMetadataKey.BLACK_NAME) ||
    metadata.getStandardMetadata(RecordMetadataKey.BLACK_SHORT_NAME);
  if (black) {
    ret += "_" + black;
  }
  const white =
    metadata.getStandardMetadata(RecordMetadataKey.WHITE_NAME) ||
    metadata.getStandardMetadata(RecordMetadataKey.WHITE_SHORT_NAME);
  if (white) {
    ret += "_" + white;
  }
  return ret.trim().replaceAll("/", "_").replaceAll("\\", "_") + ".kif";
}

function getDateString(metadata: ImmutableRecordMetadata): string {
  const date =
    metadata.getStandardMetadata(RecordMetadataKey.START_DATETIME) ||
    metadata.getStandardMetadata(RecordMetadataKey.DATE);
  if (date) {
    return date
      .trim()
      .replaceAll(" ", "_")
      .replaceAll("/", "")
      .replaceAll(":", "");
  }
  return new Date()
    .toLocaleDateString(undefined, {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    })
    .replaceAll("/", "");
}
