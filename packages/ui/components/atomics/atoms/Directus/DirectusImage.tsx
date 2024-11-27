import Image, { ImageProps } from 'next/image'
import { DirectusFile, DirectusFileProps } from './DirectusFile'

const DirectusImage: React.FC<
    Omit<ImageProps, 'src'> & Omit<DirectusFileProps, 'render'>
> = ({
    directus,
    apiUrl,
    accessToken,
    asset,
    download,
    directusTransform,
    filename,
    ...props
}) => (
    <DirectusFile
        directus={directus}
        apiUrl={apiUrl}
        accessToken={accessToken}
        asset={asset}
        download={download}
        directusTransform={directusTransform}
        filename={filename}
        render={({ url }) => {
            return <Image {...props} src={url || ''} />
        }}
    />
)

export default DirectusImage
