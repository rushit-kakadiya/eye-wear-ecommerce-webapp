const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const Sequelize = require('sequelize');
const axios = require('axios');

let config = {
    'databases': {
        'postgres': {
            'hostName': 'db.weeknds.com',
            'dbName': 'postgres',
            'userName': 'eyewear',
            'passoword': 'pa$$word',
            'port': '5432'
        },
    },
    'turboly': {
      'authEmail': '81a9649d-9090-4328-8878-60c50229bd5a@turboly.com',
      'authToken': 'e94nz1Q_YpxCQybB2uxRhdKm'
    },
    'filters': {
      'shape': {
        'square': 1,
        'rectangle': 2,
        'round': 3,
        'aviator': 4,
        'cat-eye': 5
      },
      'fit': {
        'arrow': 1,
        'normal': 2,
        'wide': 3,
        'super-wide': 4
      },
      'material': {
        'acetate': 1,
        'metal': 2,
        'mixed': 3,
        'titanium': 4
      }
    }
};

const axiosClient = ({url, headers = {}, method, params, data}) => {
  let options = {
      url,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      },
      params,
      data
  };

  return axios(options);
};

const sequelize = new Sequelize(
    config.databases.postgres.dbName,
    config.databases.postgres.userName,
    config.databases.postgres.passoword,
    {
      dialect: 'postgres',
      host: config.databases.postgres.hostName,
      pool: {
        max: 10,
        min: 0,
        idle: 200000,
        acquire: 1000000,
      },
      define: {
        timestamps: false,
      },
      timezone: '+05:30',
    }
  );

// let products = require('./products.json');
// let colors = require('./color.json');
// let frames = require('./frames.json');

let products = [];
let colors = [];
let frames = [];


const Variants = sequelize.define(
    'variants',
    {
      id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
      },
      sku_code: {
          type: Sequelize.STRING(10),
          allowNull: false,
      },
      variant_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      variant_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      variant_color_group: {
        type: Sequelize.ARRAY(Sequelize.STRING(50)),
        allowNull: false,
      },
      variant_icon_url: {
          type: Sequelize.TEXT,
          allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
    },
    {
      schema: 'eyewear',
      freezeTableName: true,
      timestamps: false,
      collate: 'utf8_unicode_ci',
      charset: 'utf8',
    }
);

const Frames = sequelize.define(
    'frame',
    {
      id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
      },
      sku_code: {
          type: Sequelize.STRING(10),
          allowNull: false,
      },
      frame_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      frame_name: {
          type: Sequelize.STRING(255),
          allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
    },
    {
      schema: 'eyewear',
      freezeTableName: true,
      timestamps: false,
      collate: 'utf8_unicode_ci',
      charset: 'utf8',
    }
);

const FrameDetails = sequelize.define(
    'frame_details',
    {
      id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
      },
      frame_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      fit: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      frame_shape: {
        type: Sequelize.ARRAY(Sequelize.STRING(50)),
        allowNull: false,
      },
      material: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      face_shape: {
        type: Sequelize.ARRAY(Sequelize.STRING(50)),
        allowNull: false,
      },
      gender: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
    },
    {
      schema: 'eyewear',
      freezeTableName: true,
      timestamps: false,
      collate: 'utf8_unicode_ci',
      charset: 'utf8',
    }
);

const FrameSizeDetails = sequelize.define(
    'frame_sizes',
    {
      id: {
          type: Sequelize.UUID,
          allowNull: false,
          primaryKey: true,
      },
      sku_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      frame_code: {
        type: Sequelize.STRING(10),
        allowNull: false,
      },
      size_key: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size_label: {
        type: Sequelize.STRING(50),
        allowNull: false,
      },
      size_code: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      lense_width: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'NA',
      },
      bridge: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'NA',
      },
      temple_length: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'NA',
      },
      front_width: {
        type: Sequelize.STRING(10),
        allowNull: false,
        defaultValue: 'NA',
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: new Date(),
      },
      updated_at: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1
      },
    },
    {
      schema: 'eyewear',
      freezeTableName: true,
      timestamps: false,
      collate: 'utf8_unicode_ci',
      charset: 'utf8',
    }
);


const ProductStock = sequelize.define(
  'product_stocks',
  {
    product_id: {
        type: Sequelize.STRING(50),
        allowNull: false,
    },
    sku: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    store_id: {
      type: Sequelize.STRING(50),
      allowNull: false,
    },
    store_name: {
      type: Sequelize.STRING(500),
      allowNull: false,
    },
    quantity: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    reserved: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    in_transit_orders: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    in_transit_transfers: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
  },
  {
    schema: 'eyewear',
    freezeTableName: true,
    timestamps: false,
    collate: 'utf8_unicode_ci',
    charset: 'utf8',
  }
);

const insertVariants = async () => {
    await Variants.sync({force:true});
    let variants = [];
    _.forEach(colors, color => {
      let colorGroup = [];
      let colorGroups = color['Color Filter Grouping'].split(',');
      _.forEach(colorGroups, fs => {
        if(fs.toLowerCase().trim() === 'two tone') { fs = 'two_tone' ;}
        colorGroup.push(fs.toLowerCase().trim());
      });
      console.log(`-----------${color['Image File Name*']}.png`);
        let variant =  {
            id: uuidv4(),
            sku_code: color['SKU Code'],
            variant_code: `CR${color['SKU Code']}`,
            variant_name: color['Color Name'],
            variant_color_group: colorGroup,
            variant_icon_url: `https://eyewear-staging-products.s3.ap-south-1.amazonaws.com/variant_icon/${color['Image File Name*']}.png`,
        };
        // variant.variant_color_group = variant.variant_color_group.toLowerCase();
        variants.push(variant);
    });

    await Variants.bulkCreate(variants);
    console.log('-- Variants inserted --');
};

const insertFrames = async () => {
    await Frames.sync({force:true});
    let dbFrames = [];
    _.forEach(frames, frame => {
        let sku = frame['SKU Code'].substring(2, 4);
        let fm =  {
            id: uuidv4(),
            sku_code: sku,
            frame_code: `FR000${sku}`,
            frame_name: frame['Frame Name'],
        };
        dbFrames.push(fm);
    });

    await Frames.bulkCreate(dbFrames);
    console.log('-- Frames inserted --');
};

const insertFrameDetails = async () => {
    await FrameDetails.sync({force:true});
    let dbFrames = [];
    _.forEach(frames, frame => {
        let sku = frame['SKU Code'].substring(2, 4);
        let frameShapes = frame['Frame Shape'].split(',');
        let faceShapes = frame['Face Shape'].split(',');
        let fshp = [];
        let fshp1 = ['round',
        'square',
        'oval',
        'heart'];

        _.forEach(frameShapes, fs => {fshp.push(fs.toLowerCase().trim());});
        _.forEach(faceShapes, fs => {fshp1.push(fs.toLowerCase().trim());});

        let fm =  {
            id: uuidv4(),
            frame_code: `FR000${sku}`,
            fit: frame['Size/FIT'].toLowerCase(),
            frame_shape: fshp,
            material: frame['Material'].toLowerCase(),
            face_shape: fshp1,
            gender: frame['Gender'].toLowerCase(),
        };
        // "Size/FIT": "Medium",
        // "Frame Shape": "Cat eye",
        // "Material": "Acetate",
        // "Face Shape": "",
        // "Gender": "Female"
        dbFrames.push(fm);
        // console.log(frameShapes);
    });

    console.log(dbFrames[0]);

    await FrameDetails.bulkCreate(dbFrames);
    console.log('-- Frame details inserted --');
};


const insertFrameSizes = async () => {
    await FrameSizeDetails.sync({force:true});
    let dbFrames = [];
    _.forEach(frames, frame => {
        let sku = frame['SKU Code'].substring(2, 4);
        let sizeArray = [
            {
                size: 'narrow',
                size_code: 1,
                size_label: 'Narrow',
            },{
                size: 'medium',
                size_code: 2,
                size_label: 'Medium',
            },{
                size: 'wide',
                size_code: 3,
                size_label: 'Wide',
            },{
                size: 'extra_wide',
                size_code: 4,
                size_label: 'Extra Wide',
            },
        ];
        _.forEach(sizeArray, sz => {
            let fm =  {
                id: uuidv4(),
                sku_code: sku,
                frame_code: `FR000${sku}`,
                size_key: sz.size,
                size_code: sz.size_code,
                size_label: sz.size_label,
            };
            dbFrames.push(fm);
        });
        
    });

    await FrameSizeDetails.bulkCreate(dbFrames);
    console.log('-- Frames inserted --');
};


const updateProductStock = async () => {
  console.log('---- updateProductStock ----');
  await ProductStock.sync({force:true});

  let pageLimit = 300;
  const response = await axiosClient({
    url: 'https://sandbox.turboly.com/api/v1/stocks',
    headers: {
        // 'X-AUTH-EMAIL': config.turboly.authEmail,
        // 'X-AUTH-TOKEN': config.turboly.authToken
        'X-AUTH-EMAIL': '578158c9-93a4-4bb3-97a2-82a7c04e9955@turboly.com',
        'X-AUTH-TOKEN': 'jeJDKhGkAbE86UQHWYWaMy74'
    },
    method: 'GET',
    params: {
      page_limit: pageLimit,
      store_id: 6598
    },
    data: {},
  });

  if(response.status == 200) {
    await ProductStock.bulkCreate(response.data.stocks);
    for (let i = 2; i <= response.data.pages; i++) {
      const result = await axiosClient({
        url: 'https://sandbox.turboly.com/api/v1/stocks',
        headers: {
            // 'X-AUTH-EMAIL': config.turboly.authEmail,
            // 'X-AUTH-TOKEN': config.turboly.authToken
            'X-AUTH-EMAIL': '578158c9-93a4-4bb3-97a2-82a7c04e9955@turboly.com',
            'X-AUTH-TOKEN': 'jeJDKhGkAbE86UQHWYWaMy74'
        },
        method: 'GET',
        params: {
          page: i,
          page_limit: pageLimit,
          store_id: 6598
        },
        data: {},
      });
      if(result.status == 200) {
        if (!_.isEmpty (result.data.stocks)) await ProductStock.bulkCreate(result.data.stocks)
        ;
      }
    }
  }

  await ProductStock.bulkCreate(response.data);
  console.log('-- Stock inserted --');
};

updateProductStock();

// insertVariants();
// insertFrames();
// insertFrameDetails();
// insertFrameSizes();

// let clr1 = [];

// _.forEach(colors, clr => {
//   let clr2 = clr['Color Filter Grouping'].split(',');
//   _.forEach(clr2, fs => {
//     // let enteredClr = _.find(clr1, (cr) => { return cr == fs; });
//     clr1.push(fs.trim());
    
//   });
// });


// let uniques = _.union(clr1);

// console.log(uniques);

// [
//   Black
//   Tortoise
//   Two Tone
//   Silver
//   Blue
//   Grey
//   Clear
//   Gold
//   'N/A - discontinue'
// ]


