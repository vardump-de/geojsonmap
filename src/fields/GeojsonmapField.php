<?php
/**
 * geojsonmap plugin for Craft CMS 3.x
 *
 * Test
 *
 * @link      https://webworker.me/
 * @copyright Copyright (c) 2019 Andi Grether
 */

namespace vardump\geojsonmap\fields;

use vardump\geojsonmap\Geojsonmap;
use vardump\geojsonmap\assetbundles\geojsonmap\GeojsonmapAsset;

use Craft;
use craft\base\ElementInterface;
use craft\base\Field;
use craft\helpers\Db;
use yii\db\Schema;
use craft\helpers\Json;

/**
 * GeojsonmapField Field
 *
 * Whenever someone creates a new field in Craft, they must specify what
 * type of field it is. The system comes with a handful of field types baked in,
 * and we’ve made it extremely easy for plugins to add new ones.
 *
 * https://craftcms.com/docs/plugins/field-types
 *
 * @author    Andi Grether
 * @package   Geojsonmap
 * @since     1.0.0
 */
class GeojsonmapField extends Field
{
    // Public Properties
    // =========================================================================

    /**
     * Some attribute
     *
     * @var string
     */
    public $mapcenterLatitude = '52.520008';
    public $mapcenterLongitude = '13.404954';
    public $mapheight = 500;
    public $mapzoom = 10;

    // Static Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public static function displayName(): string
    {
        return Craft::t('geojsonmap', 'Geojsonmap');
    }

    // Public Methods
    // =========================================================================

    /**
     * @inheritdoc
     */
    public function rules()
    {
        $rules = parent::rules();

        $rules[] = [
            'mapcenterLatitude',
            'double',
            'min' => -90,
            'max' => 90
        ];

        $rules[] = [
            'mapcenterLongitude',
            'double',
            'min' => -180,
            'max' => 180
        ];

        $rules[] = [
            'mapheight',
            'integer',
            'min' => 100,
            'max' => 2000
        ];

        $rules[] = [
            'mapzoom',
            'integer',
            'min' => 5,
            'max' => 18
        ];

        return $rules;
    }

    /**
     * @inheritdoc
     */
    public function getContentColumnType(): string
    {
        return Schema::TYPE_TEXT;
    }

    /**
     * @inheritdoc
     */
    public function normalizeValue($value, ElementInterface $element = null)
    {
        return $value;
    }

    /**
     * @inheritdoc
     */
    public function serializeValue($value, ElementInterface $element = null)
    {
        return parent::serializeValue($value, $element);
    }

    /**
     * @inheritdoc
     */
    public function getSettingsHtml()
    {
        // Render the settings template
        return Craft::$app->getView()->renderTemplate(
            'geojsonmap/_components/fields/GeojsonmapField_settings',
            [
                'field' => $this,
            ]
        );
    }

    /**
     * @inheritdoc
     */
    public function getInputHtml($value, ElementInterface $element = null): string
    {
        // Get our id and namespace
        $view = Craft::$app->getView();
        $locale = Craft::$app->locale->id;
        $id = Craft::$app->getView()->formatInputId($this->handle);
        $namespacedId = Craft::$app->getView()->namespaceInputId($id);
        $mapHeight = $this->mapheight;
        $mapLat = $this->mapcenterLatitude;
        $mapLng = $this->mapcenterLongitude;
        $mapZoom = $this->mapzoom;

        // Register our asset bundle
        Craft::$app->getView()->registerAssetBundle(GeojsonmapAsset::class);
        $view->registerJs("new Geojsonmap('{$namespacedId}', '{$mapLat}', '{$mapLng}', '{$mapHeight}', '{$mapZoom}')");

        // Render the input template
        return Craft::$app->getView()->renderTemplate(
            'geojsonmap/_components/fields/GeojsonmapField_input',
            [
                'name' => $this->handle,
                'value' => $value,
                'field' => $this,
                'id' => $id,
                'namespacedId' => $namespacedId,
            ]
        );
    }
}
