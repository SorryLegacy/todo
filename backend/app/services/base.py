from typing import Union
from dataclasses import dataclass
from sqlmodel import SQLModel
from sqlalchemy import Select
from sqlalchemy.ext.asyncio.session import AsyncSession


@dataclass(kw_only=True)
class BaseCRUDService:
    session: AsyncSession

    async def scalar_or_none(self, query: Select[tuple['SQLModel']]) -> Union['SQLModel', None]:
        result = await self.session.execute(query)
        return result.scalar()
