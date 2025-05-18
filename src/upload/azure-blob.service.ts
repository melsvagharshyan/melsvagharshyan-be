// azure-blob.service.ts
import { Injectable } from '@nestjs/common';
import { BlobServiceClient } from '@azure/storage-blob';
import { v4 as uuid } from 'uuid';

@Injectable()
export class AzureBlobService {
  private readonly blobServiceClient: BlobServiceClient;
  private readonly containerName = process.env.AZURE_CONTAINER_NAME!;
  private readonly connectionString = process.env.AZURE_CONNECTION_URL!;

  constructor() {
    this.blobServiceClient = BlobServiceClient.fromConnectionString(
      this.connectionString,
    );
  }

  async uploadBase64Image(base64: string): Promise<string> {
    const base64Data = base64.replace(/^data:image\/\w+;base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');
    const extension = this.getExtensionFromBase64(base64);
    const blobName = `img_${uuid()}.${extension}`;

    const containerClient = this.blobServiceClient.getContainerClient(
      this.containerName,
    );
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: `image/${extension}`,
      },
    });

    return blockBlobClient.url;
  }

  private getExtensionFromBase64(base64: string): string {
    const match = base64.match(/^data:image\/(\w+);base64,/);
    return match ? match[1] : 'png'; // default to png if not found
  }
}
