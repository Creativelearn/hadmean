import { userFriendlyCase } from 'frontend/lib/strings';
import { EntityTypesForSelection } from 'frontend/views/entity/Configure/Fields/FieldsSelection';
import {
  isUseColorsFlagOn,
  SYSTEM_COLORS,
} from 'frontend/views/entity/Configure/Fields/selection.utils';
import { IColorableSelection } from 'frontend/views/entity/Configure/Fields/types';
import { uniqBy } from 'lodash';

export const getEntitySelectionConfig = (
  entityType: EntityTypesForSelection,
  preSelectedType: IColorableSelection[],
  enumList: string[],
): IColorableSelection[] => {
  switch (entityType) {
    case 'boolean':
      return preSelectedType ?? [
        {
          value: true,
          label: 'Yes',
          color: SYSTEM_COLORS[0],
        },
        {
          value: false,
          label: 'No',
          color: SYSTEM_COLORS[1],
        },
      ];
    case 'selection':
      return preSelectedType ?? [];

    case 'reference':
      return preSelectedType ?? [];

    case 'selection-enum': {
      const preselection = preSelectedType ?? [];

      const shouldUseColor = isUseColorsFlagOn(preselection);
      const enumsFromDb = enumList || [];

      return uniqBy(
        [
          ...enumsFromDb.map((enumValue, index) => ({
            value: enumValue,
            label: userFriendlyCase(enumValue),
            color: shouldUseColor ? SYSTEM_COLORS[index % SYSTEM_COLORS.length] : undefined,
          })),
          ...preselection,
        ],
        'value',
      );
    }
  }
};