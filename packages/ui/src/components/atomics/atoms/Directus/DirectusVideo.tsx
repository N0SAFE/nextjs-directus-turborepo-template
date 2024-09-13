import { DirectusFile, DirectusFileProps } from './DirectusFile'

type VideoProps = React.DetailedHTMLProps<
    React.VideoHTMLAttributes<HTMLVideoElement>,
    HTMLVideoElement
>

const DirectusVideo: React.FC<
    VideoProps & Omit<DirectusFileProps, 'render'>
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
            return <video {...props} src={url || ''} />
        }}
    />
)

export default DirectusVideo
