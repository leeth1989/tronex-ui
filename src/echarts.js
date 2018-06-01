
// $.getJSON('data-gl/asset/data/population.json', function (data) {
  $.getJSON('https://api.tronscan.org/api/node', function (data) {
    console.log(data)
        data = data.nodes.map(function (dataItem) {
            return {
                name: dataItem.city,
                            value: [dataItem.lng, dataItem.lat, Math.random(0,1) *60]
    
                // value: [dataItem.lat, dataItem.lng, 10]
            }
        });
        console.log(data)
    
        myChart.setOption({
            visualMap: {
                show: true,
                min: 0,
                max: 60,
                inRange: {
                    symbolSize: [1.0, 10.0],
                color: ['#010103', '#2f490c', '#b0b70f', '#fdff44', '#fff'],
                colorAlpha: [0.2, 1]
                }
            },
             globe: {
              
                environment: 'data-gl/asset/starfield.jpg',
    
                heightTexture: 'data-gl/asset/bathymetry_bw_composite_4k.jpg',
    
                displacementScale: 0.05,
                displacementQuality: 'high',
    
                globeOuterRadius: 100,
    
                baseColor: '#000',
    
                shading: 'realistic',
                realisticMaterial: {
                    roughness: 0.2,
                    metalness: 0
                },
    
                postEffect: {
                    enable: true,
                    depthOfField: {
                        enable: false,
                        focalDistance: 150
                    }
                },
                temporalSuperSampling: {
                    enable: true
                },
                light: {
                    ambient: {
                        intensity: 0
                    },
                    main: {
                        intensity: 0.1,
                        shadow: false
                    },
                    ambientCubemap: {
                        texture: 'data-gl/asset/lake.hdr',
                        exposure: 1,
                        diffuseIntensity: 0.5,
                        specularIntensity: 2
                    }
                },
                viewControl: {
                    autoRotate: true,
                    beta: 180,
                    alpha: 20,
                    distance: 200
                },
            },
            series: {
                type: 'scatter3D',
                coordinateSystem: 'globe',
                blendMode: 'lighter',
                symbolSize: 2,
                label: {formatter: (params) => {return params.name;}},
                // symbol: 'diamond',
                itemStyle: {
                    // color: 'red',
                    // borderColor: '#fff',
                    // opacity: 0.5
                },
                animationDurationUpdate: 3000,
                data: data
            }
        });
    });
    