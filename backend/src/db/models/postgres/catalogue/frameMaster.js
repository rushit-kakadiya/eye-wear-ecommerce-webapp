/*
 * Frame Master DB Schema
 */

const Sequelize = require('sequelize');
const { sequelize } = require('../../../../core');

const FrameMaster = sequelize.define(
  'frame_master',
  {
    id: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    sku_code: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    hto_sku_code: {
      type: Sequelize.STRING(20),
      allowNull: false,
      unique: true,
    },
    frame_id: {
      type: Sequelize.STRING(36),
      allowNull: true,
    },
    frame_code: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    frame_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    fit: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    frame_shape: {
      type: Sequelize.ARRAY(Sequelize.STRING(100)),
      allowNull: true,
    },
    material: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    face_shape: {
      type: Sequelize.ARRAY(Sequelize.STRING(100)),
      allowNull: true,
    },
    gender: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    frame_description: {
      type: Sequelize.TEXT,
      allowNull: true,
    },
    frame_rank: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    variant_id: {
      type: Sequelize.STRING(36),
      allowNull: true,
    },
    variant_code: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    variant_name: {
      type: Sequelize.STRING(255),
      allowNull: true,
    },
    variant_color_group: {
      type: Sequelize.ARRAY(Sequelize.STRING(30)),
      allowNull: true,
    },
    icon_image_key: {
      type: Sequelize.STRING(500),
      allowNull: true,
    },
    variant_rank: {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: 1,
    },
    size_code: {
      type: Sequelize.STRING(10),
      allowNull: false,
    },
    size_key: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    size_label: {
      type: Sequelize.STRING(50),
      allowNull: true,
    },
    lense_width: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    bridge: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    temple_length: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    front_width: {
      type: Sequelize.STRING(10),
      allowNull: true,
    },
    is_sunwear: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    is_hto: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    top_pick: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    new_arrival: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    eyewear_vto: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    sunwear_vto: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    created_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    updated_at: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: new Date(),
    },
    status: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    show_on_app: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    show_sunwear_on_app: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    }
  },
  {
    schema: 'eyewear',
    freezeTableName: true,
    timestamps: false,
    collate: 'utf8_unicode_ci',
    charset: 'utf8',
  }
);

module.exports = FrameMaster;
