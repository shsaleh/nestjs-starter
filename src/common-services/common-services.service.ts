import { Injectable, ConflictException } from '@nestjs/common';
import { Repository } from 'typeorm';

@Injectable()
export class CommonServices {
  async checkForDuplicateFields(
    repository: Repository<any>,
    fields: Array<{ field: string; value: any }>,
  ): Promise<void> {
    const whereConditions = fields.map((field) => ({
      [field.field]: field.value,
    }));

    const found = await repository.findOne({
      where: whereConditions,
    });

    if (found) {
      const duplicateFields = fields
        .filter((field) => found[field.field] === field.value)
        .map((field) => field.field);

      if (duplicateFields.length > 0) {
        throw new ConflictException({
          message: `Duplicate entry`,
          fields: JSON.stringify(duplicateFields),
        });
      }
    }
  }
}
