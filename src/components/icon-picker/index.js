/**
 * External dependencies
 */
import classnames from 'classnames';

/**
 * WordPress dependencies
 */
const { Component, Fragment } = wp.element;
const { compose } = wp.compose;
const { __ } = wp.i18n;
const { withSelect } = wp.data;
const { PlainText } = wp.editor;

const {
	Button,
	Modal,
	Placeholder,
	Tooltip,
} = wp.components;

/**
 * Internal dependencies
 */
import './editor.scss';

const ICONS = [
	'address-book', 'address-card', 'adjust', 'air-freshener', 'align-center', 'align-justify', 'align-left', 'align-right', 'allergies', 'ambulance', 'american-sign-language-interpreting', 'anchor', 'angle-double-down', 'angle-double-left', 'angle-double-right', 'angle-double-up', 'angle-down', 'angle-left', 'angle-right', 'angle-up', 'angry', 'apple-alt', 'archive', 'archway', 'arrow-alt-circle-down', 'arrow-alt-circle-left', 'arrow-alt-circle-right', 'arrow-alt-circle-up', 'arrow-circle-down', 'arrow-circle-left', 'arrow-circle-right', 'arrow-circle-up', 'arrow-down', 'arrow-left', 'arrow-right', 'arrow-up', 'arrows-alt', 'arrows-alt-h', 'arrows-alt-v', 'assistive-listening-systems', 'asterisk', 'at', 'atlas', 'atom', 'audio-description', 'award', 'backspace', 'backward', 'balance-scale', 'ban', 'band-aid', 'barcode', 'bars', 'baseball-ball', 'basketball-ball', 'bath', 'battery-empty', 'battery-full', 'battery-half', 'battery-quarter', 'battery-three-quarters', 'bed', 'beer', 'bell', 'bell-slash', 'bezier-curve', 'bicycle', 'binoculars', 'birthday-cake', 'blender', 'blind', 'bold', 'bolt', 'bomb', 'bone', 'bong', 'book', 'book-open', 'book-reader', 'bookmark', 'bowling-ball', 'box', 'box-open', 'boxes', 'braille', 'brain', 'briefcase', 'briefcase-medical', 'broadcast-tower', 'broom', 'brush', 'bug', 'building', 'bullhorn', 'bullseye', 'burn', 'bus', 'bus-alt', 'calculator', 'calendar', 'calendar-alt', 'calendar-check', 'calendar-minus', 'calendar-plus', 'calendar-times', 'camera', 'camera-retro', 'cannabis', 'capsules', 'car', 'car-alt', 'car-battery', 'car-crash', 'car-side', 'caret-down', 'caret-left', 'caret-right', 'caret-square-down', 'caret-square-left', 'caret-square-right', 'caret-square-up', 'caret-up', 'cart-arrow-down', 'cart-plus', 'certificate', 'chalkboard', 'chalkboard-teacher', 'charging-station', 'chart-area', 'chart-bar', 'chart-line', 'chart-pie', 'check', 'check-circle', 'check-double', 'check-square', 'chess', 'chess-bishop', 'chess-board', 'chess-king', 'chess-knight', 'chess-pawn', 'chess-queen', 'chess-rook', 'chevron-circle-down', 'chevron-circle-left', 'chevron-circle-right', 'chevron-circle-up', 'chevron-down', 'chevron-left', 'chevron-right', 'chevron-up', 'child', 'church', 'circle', 'circle-notch', 'clipboard', 'clipboard-check', 'clipboard-list', 'clock', 'clone', 'closed-captioning', 'cloud', 'cloud-download-alt', 'cloud-upload-alt', 'cocktail', 'code', 'code-branch', 'coffee', 'cog', 'cogs', 'coins', 'columns', 'comment', 'comment-alt', 'comment-dots', 'comment-slash', 'comments', 'compact-disc', 'compass', 'compress', 'concierge-bell', 'cookie', 'cookie-bite', 'copy', 'copyright', 'couch', 'credit-card', 'crop', 'crop-alt', 'crosshairs', 'crow', 'crown', 'cube', 'cubes', 'cut', 'database', 'deaf', 'desktop', 'diagnoses', 'dice', 'dice-five', 'dice-four', 'dice-one', 'dice-six', 'dice-three', 'dice-two', 'digital-tachograph', 'directions', 'divide', 'dizzy', 'dna', 'dollar-sign', 'dolly', 'dolly-flatbed', 'donate', 'door-closed', 'door-open', 'dot-circle', 'dove', 'download', 'drafting-compass', 'draw-polygon', 'drum', 'drum-steelpan', 'dumbbell', 'edit', 'eject', 'ellipsis-h', 'ellipsis-v', 'envelope', 'envelope-open', 'envelope-square', 'equals', 'eraser', 'euro-sign', 'exchange-alt', 'exclamation', 'exclamation-circle', 'exclamation-triangle', 'expand', 'expand-arrows-alt', 'external-link-alt', 'external-link-square-alt', 'eye', 'eye-dropper', 'eye-slash', 'fast-backward', 'fast-forward', 'fax', 'feather', 'feather-alt', 'female', 'fighter-jet', 'file', 'file-alt', 'file-archive', 'file-audio', 'file-code', 'file-contract', 'file-download', 'file-excel', 'file-export', 'file-image', 'file-import', 'file-invoice', 'file-invoice-dollar', 'file-medical', 'file-medical-alt', 'file-pdf', 'file-powerpoint', 'file-prescription', 'file-signature', 'file-upload', 'file-video', 'file-word', 'fill', 'fill-drip', 'film', 'filter', 'fingerprint', 'fire', 'fire-extinguisher', 'first-aid', 'fish', 'flag', 'flag-checkered', 'flask', 'flushed', 'folder', 'folder-open', 'font', 'font-awesome-logo-full', 'football-ball', 'forward', 'frog', 'frown', 'frown-open', 'futbol', 'gamepad', 'gas-pump', 'gavel', 'gem', 'genderless', 'gift', 'glass-martini', 'glass-martini-alt', 'glasses', 'globe', 'globe-africa', 'globe-americas', 'globe-asia', 'golf-ball', 'graduation-cap', 'greater-than', 'greater-than-equal', 'grimace', 'grin', 'grin-alt', 'grin-beam', 'grin-beam-sweat', 'grin-hearts', 'grin-squint', 'grin-squint-tears', 'grin-stars', 'grin-tears', 'grin-tongue', 'grin-tongue-squint', 'grin-tongue-wink', 'grin-wink', 'grip-horizontal', 'grip-vertical', 'h-square', 'hand-holding', 'hand-holding-heart', 'hand-holding-usd', 'hand-lizard', 'hand-paper', 'hand-peace', 'hand-point-down', 'hand-point-left', 'hand-point-right', 'hand-point-up', 'hand-pointer', 'hand-rock', 'hand-scissors', 'hand-spock', 'hands', 'hands-helping', 'handshake', 'hashtag', 'hdd', 'heading', 'headphones', 'headphones-alt', 'headset', 'heart', 'heartbeat', 'helicopter', 'highlighter', 'history', 'hockey-puck', 'home', 'hospital', 'hospital-alt', 'hospital-symbol', 'hot-tub', 'hotel', 'hourglass', 'hourglass-end', 'hourglass-half', 'hourglass-start', 'i-cursor', 'id-badge', 'id-card', 'id-card-alt', 'image', 'images', 'inbox', 'indent', 'industry', 'infinity', 'info', 'info-circle', 'italic', 'joint', 'key', 'keyboard', 'kiss', 'kiss-beam', 'kiss-wink-heart', 'kiwi-bird', 'language', 'laptop', 'laptop-code', 'laugh', 'laugh-beam', 'laugh-squint', 'laugh-wink', 'layer-group', 'leaf', 'lemon', 'less-than', 'less-than-equal', 'level-down-alt', 'level-up-alt', 'life-ring', 'lightbulb', 'link', 'lira-sign', 'list', 'list-alt', 'list-ol', 'list-ul', 'location-arrow', 'lock', 'lock-open', 'long-arrow-alt-down', 'long-arrow-alt-left', 'long-arrow-alt-right', 'long-arrow-alt-up', 'low-vision', 'luggage-cart', 'magic', 'magnet', 'male', 'map', 'map-marked', 'map-marked-alt', 'map-marker', 'map-marker-alt', 'map-pin', 'map-signs', 'marker', 'mars', 'mars-double', 'mars-stroke', 'mars-stroke-h', 'mars-stroke-v', 'medal', 'medkit', 'meh', 'meh-blank', 'meh-rolling-eyes', 'memory', 'mercury', 'microchip', 'microphone', 'microphone-alt', 'microphone-alt-slash', 'microphone-slash', 'microscope', 'minus', 'minus-circle', 'minus-square', 'mobile', 'mobile-alt', 'money-bill', 'money-bill-alt', 'money-bill-wave', 'money-bill-wave-alt', 'money-check', 'money-check-alt', 'monument', 'moon', 'mortar-pestle', 'motorcycle', 'mouse-pointer', 'music', 'neuter', 'newspaper', 'not-equal', 'notes-medical', 'object-group', 'object-ungroup', 'oil-can', 'outdent', 'paint-brush', 'paint-roller', 'palette', 'pallet', 'paper-plane', 'paperclip', 'parachute-box', 'paragraph', 'parking', 'passport', 'paste', 'pause', 'pause-circle', 'paw', 'pen', 'pen-alt', 'pen-fancy', 'pen-nib', 'pen-square', 'pencil-alt', 'pencil-ruler', 'people-carry', 'percent', 'percentage', 'phone', 'phone-slash', 'phone-square', 'phone-volume', 'piggy-bank', 'pills', 'plane', 'plane-arrival', 'plane-departure', 'play', 'play-circle', 'plug', 'plus', 'plus-circle', 'plus-square', 'podcast', 'poo', 'poop', 'portrait', 'pound-sign', 'power-off', 'prescription', 'prescription-bottle', 'prescription-bottle-alt', 'print', 'procedures', 'project-diagram', 'puzzle-piece', 'qrcode', 'question', 'question-circle', 'quidditch', 'quote-left', 'quote-right', 'random', 'receipt', 'recycle', 'redo', 'redo-alt', 'registered', 'reply', 'reply-all', 'retweet', 'ribbon', 'road', 'robot', 'rocket', 'route', 'rss', 'rss-square', 'ruble-sign', 'ruler', 'ruler-combined', 'ruler-horizontal', 'ruler-vertical', 'rupee-sign', 'sad-cry', 'sad-tear', 'save', 'school', 'screwdriver', 'search', 'search-minus', 'search-plus', 'seedling', 'server', 'shapes', 'share', 'share-alt', 'share-alt-square', 'share-square', 'shekel-sign', 'shield-alt', 'ship', 'shipping-fast', 'shoe-prints', 'shopping-bag', 'shopping-basket', 'shopping-cart', 'shower', 'shuttle-van', 'sign', 'sign-in-alt', 'sign-language', 'sign-out-alt', 'signal', 'signature', 'sitemap', 'skull', 'sliders-h', 'smile', 'smile-beam', 'smile-wink', 'smoking', 'smoking-ban', 'snowflake', 'solar-panel', 'sort', 'sort-alpha-down', 'sort-alpha-up', 'sort-amount-down', 'sort-amount-up', 'sort-down', 'sort-numeric-down', 'sort-numeric-up', 'sort-up', 'spa', 'space-shuttle', 'spinner', 'splotch', 'spray-can', 'square', 'square-full', 'stamp', 'star', 'star-half', 'star-half-alt', 'star-of-life', 'step-backward', 'step-forward', 'stethoscope', 'sticky-note', 'stop', 'stop-circle', 'stopwatch', 'store', 'store-alt', 'stream', 'street-view', 'strikethrough', 'stroopwafel', 'subscript', 'subway', 'suitcase', 'suitcase-rolling', 'sun', 'superscript', 'surprise', 'swatchbook', 'swimmer', 'swimming-pool', 'sync', 'sync-alt', 'syringe', 'table', 'table-tennis', 'tablet', 'tablet-alt', 'tablets', 'tachometer-alt', 'tag', 'tags', 'tape', 'tasks', 'taxi', 'teeth', 'teeth-open', 'terminal', 'text-height', 'text-width', 'th', 'th-large', 'th-list', 'theater-masks', 'thermometer', 'thermometer-empty', 'thermometer-full', 'thermometer-half', 'thermometer-quarter', 'thermometer-three-quarters', 'thumbs-down', 'thumbs-up', 'thumbtack', 'ticket-alt', 'times', 'times-circle', 'tint', 'tint-slash', 'tired', 'toggle-off', 'toggle-on', 'toolbox', 'tooth', 'trademark', 'traffic-light', 'train', 'transgender', 'transgender-alt', 'trash', 'trash-alt', 'tree', 'trophy', 'truck', 'truck-loading', 'truck-monster', 'truck-moving', 'truck-pickup', 'tshirt', 'tty', 'tv', 'umbrella', 'umbrella-beach', 'underline', 'undo', 'undo-alt', 'universal-access', 'university', 'unlink', 'unlock', 'unlock-alt', 'upload', 'user', 'user-alt', 'user-alt-slash', 'user-astronaut', 'user-check', 'user-circle', 'user-clock', 'user-cog', 'user-edit', 'user-friends', 'user-graduate', 'user-lock', 'user-md', 'user-minus', 'user-ninja', 'user-plus', 'user-secret', 'user-shield', 'user-slash', 'user-tag', 'user-tie', 'user-times', 'users', 'users-cog', 'utensil-spoon', 'utensils', 'vector-square', 'venus', 'venus-double', 'venus-mars', 'vial', 'vials', 'video', 'video-slash', 'volleyball-ball', 'volume-down', 'volume-off', 'volume-up', 'walking', 'wallet', 'warehouse', 'weight', 'weight-hanging', 'wheelchair', 'wifi', 'window-close', 'window-maximize', 'window-minimize', 'window-restore', 'wine-glass', 'wine-glass-alt', 'won-sign', 'wrench', 'x-ray', 'yen-sign',
];

class IconPicker extends Component {
	constructor() {
		super( ...arguments );
		this.openModal = this.openModal.bind( this );
		this.closeModal = this.closeModal.bind( this );
		this.searchIcon = this.searchIcon.bind( this );

		this.state = {
			isModalActive: false,
			icons: ICONS,
		};
	}

	componentDidUpdate( prevProps, prevState ) {
		const { isModalActive } = this.state;

		// Reset icons when modal is openend.
		if ( isModalActive && ! prevState.isModalActive ) {
			this.setState( { icons: ICONS } );
		}
	}

	openModal() {
		this.setState( { isModalActive: true } );
	}

	closeModal() {
		this.setState( { isModalActive: false } );
	}

	setIcon( icon ) {
		const { onChange } = this.props;

		// Change Icon with function from parent.
		onChange( icon );

		// Hide IconPicker after icon is selected.
		this.closeModal();

		// Reset available icons.
		this.setState( { icons: ICONS } );
	}

	generateIconList() {
		const icons = this.state.icons;

		return (
			<div className="gt-icon-picker-grid">

				{
					icons.map( ( icon ) => {
						return (
							<Button
								key={ icon }
								className="gt-icon-link"
								onClick={ () => this.setIcon( icon ) }
							>
								<Tooltip text={ icon }>
									{ this.displayIcon( icon ) }
								</Tooltip>
							</Button>
						);
					} )
				}

			</div>
		);
	}

	searchIcon( input ) {
		const filtered = ICONS.filter( icon => icon.match( input.toLowerCase().trim() ) );
		this.setState( { icons: filtered } );
	}

	displayIcon( icon, iconSize = 32 ) {
		const { pluginURL } = this.props;

		const svgURL = pluginURL + 'assets/icons/fontawesome.svg#' + icon;
		const svgClass = classnames( 'icon', `icon-${ icon }` );
		const svgStyles = {
			width: iconSize !== 32 ? iconSize + 'px' : undefined,
			height: iconSize !== 32 ? iconSize + 'px' : undefined,
		};

		return (
			<span className="gt-icon-svg" data-icon={ icon }>
				<svg className={ svgClass } style={ svgStyles } aria-hidden="true" role="img">
					<use href={ svgURL }></use>
				</svg>
			</span>
		);
	}

	displayIconPlaceholder() {
		const {
			icon,
			iconClasses,
			iconStyles,
			iconSize,
			isSelected,
		} = this.props;

		return (
			<div className="gt-icon-placeholder-wrapper">

				{ ! icon ? (

					<Fragment>
						<Placeholder
							className="gt-icon-placeholder"
							instructions={ __( 'Choose an icon here.', 'gt-blocks' ) }
							icon="info"
							label={ __( 'Icon', 'gt-blocks' ) }
						>
							<Button isLarge onClick={ this.openModal }>
								{ __( 'Select icon', 'gt-blocks' ) }
							</Button>
						</Placeholder>

					</Fragment>

				) : (

					<Fragment>

						{ isSelected ? (

							<Button className="gt-show-icon-picker" onClick={ this.openModal }>
								<Tooltip text={ __( 'Edit icon', 'gt-blocks' ) }>
									<div className={ iconClasses } style={ iconStyles }>
										{ this.displayIcon( icon, iconSize ) }
									</div>
								</Tooltip>
							</Button>

						) : (

							<div className={ iconClasses } style={ iconStyles }>
								{ this.displayIcon( icon, iconSize ) }
							</div>

						) }

					</Fragment>

				) }

			</div>
		);
	}

	render() {
		const title = (
			<span className="gt-icon-picker-title">
				{ __( 'Select Icon', 'gt-blocks' ) }
				<Button onClick={ () => this.setIcon( undefined ) } className="gt-remove-icon">
					{ __( 'Remove icon', 'gt-blocks' ) }
				</Button>
			</span>
		);

		return (
			<Fragment>

				{ this.displayIconPlaceholder() }

				{ this.state.isModalActive && (
					<Modal
						className="gt-blocks-icon-picker-modal"
						title={ title }
						closeLabel={ __( 'Close', 'gt-blocks' ) }
						onRequestClose={ this.closeModal }
						focusOnMount={ false }
					>
						<PlainText
							className="gt-icon-picker-search"
							placeholder={ __( 'Search for icon', 'gt-blocks' ) }
							onChange={ this.searchIcon }
							// eslint-disable-next-line jsx-a11y/no-autofocus
							autoFocus={ true }
						/>

						<div className="gt-icon-picker-list">
							{ this.generateIconList() }
						</div>

					</Modal>
				) }

			</Fragment>
		);
	}
}

export default compose( [
	withSelect( ( select ) => {
		const pluginURL = select( 'gt-blocks-store' ).getPluginURL();

		return { pluginURL };
	} ),
] )( IconPicker );
